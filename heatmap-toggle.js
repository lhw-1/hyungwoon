// heatmap-toggle.js
//
// A stickied button that toggles a heatmap of the visitor's own cursor
// movement (mouse + touch) accumulated since the page loaded — simulating
// what a gaze heatmap would show, using cursor position as a coarse proxy.
// Purely client-side and in-memory: reloading the page resets it.
//
// Technique (the standard approach behind most gaze/cursor heatmap tools):
//   1. Record { x, y } (document coordinates) on mousemove / touchmove.
//   2. Draw a soft radial-gradient blob per point onto a persistent offscreen
//      accumulation canvas using additive ('lighter') compositing, so
//      overlapping visits build up a brighter alpha value instead of just
//      re-blending.
//   3. Run that grayscale-alpha density map through a color lookup table
//      (transparent -> blue -> green -> yellow -> red) and paint the result
//      onto the visible overlay canvas.
//
// Rendering runs on requestAnimationFrame (synced to the display's actual
// refresh rate — the fastest a repaint can ever be seen) but only touches
// what changed: each frame draws just the points recorded since the last
// frame onto the accumulation canvas, then re-colorizes only the bounding
// box those new blobs touched. Cost scales with new points per frame, not
// total history, so it stays smooth no matter how long the heatmap has been
// running.
//
// Exposes window.HeatmapFX.start()/stop() rather than owning the toggle
// button itself, since the button now switches between this and the
// ink-brush effect (brush-fx.js) — see cursor-toggle.js, which owns the
// click handler for both.
//
// TO REMOVE: delete this file, heatmap-toggle.css, cursor-toggle.js,
// brush-fx.js/.css, and (in index.html) the <button id="heatmap-toggle">,
// the <canvas id="heatmap-canvas">/<canvas id="brush-canvas">, the
// relevant <link>s, and the relevant <script> tags.

(function () {
    'use strict';

    var canvas = document.getElementById('heatmap-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');

    // ── Recording ────────────────────────────────────────────────────────────

    var points        = [];
    var lastSample     = 0;
    var SAMPLE_INTERVAL = 4;   // ms between recorded points — a safety cap, not a smoothness throttle
    var MAX_POINTS      = 6000;
    var drawnCount     = 0;    // how many points are already baked into the accumulation canvas

    function recordPoint(x, y) {
        var now = performance.now();
        if (now - lastSample < SAMPLE_INTERVAL) return;
        lastSample = now;
        points.push({ x: x, y: y });
        if (points.length > MAX_POINTS) {
            // Thin the array rather than dropping history outright. This
            // shifts every index, so force a one-off full replay afterwards
            // instead of trying to keep drawnCount in sync with the shift.
            points = points.filter(function (_, i) { return i % 2 === 0; });
            drawnCount = 0;
        }
    }

    document.addEventListener('mousemove', function (e) {
        recordPoint(e.pageX, e.pageY);
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        if (e.touches && e.touches[0]) {
            recordPoint(e.touches[0].pageX, e.touches[0].pageY);
        }
    }, { passive: true });

    // ── Color lookup table: transparent -> blue -> green -> yellow -> red ────

    var LUT = (function () {
        var lutCanvas = document.createElement('canvas');
        lutCanvas.width  = 256;
        lutCanvas.height = 1;
        var lctx = lutCanvas.getContext('2d');
        var grad = lctx.createLinearGradient(0, 0, 256, 0);
        grad.addColorStop(0.00, 'rgba(37,99,235,0)');
        grad.addColorStop(0.25, 'rgba(37,99,235,1)');
        grad.addColorStop(0.50, 'rgba(34,197,94,1)');
        grad.addColorStop(0.75, 'rgba(245,158,11,1)');
        grad.addColorStop(1.00, 'rgba(239,68,68,1)');
        lctx.fillStyle = grad;
        lctx.fillRect(0, 0, 256, 1);
        return lctx.getImageData(0, 0, 256, 1).data;
    }());

    // ── Rendering ────────────────────────────────────────────────────────────

    var RADIUS = 34;

    // Persistent raw density layer. Never colorized in place — always the
    // source of truth that the visible canvas's dirty regions are recolored
    // from.
    var offCanvas = document.createElement('canvas');
    var offCtx    = offCanvas.getContext('2d');
    var canvasW   = 0;
    var canvasH   = 0;

    function ensureCanvasSize() {
        var docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        var docW = window.innerWidth;
        if (docW === canvasW && docH === canvasH) return;

        canvasW = docW;
        canvasH = docH;
        canvas.width    = canvasW;
        canvas.height   = canvasH;
        offCanvas.width  = canvasW;
        offCanvas.height = canvasH;
        offCtx.globalCompositeOperation = 'lighter';
        drawnCount = 0;  // canvas was cleared by the resize — replay all history
    }

    // Draws points[drawnCount..] onto the accumulation canvas and returns
    // the bounding rect they touched (clamped to canvas bounds), or null if
    // there was nothing new.
    function drawNewPoints() {
        if (drawnCount >= points.length) return null;

        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var i = drawnCount; i < points.length; i++) {
            var pt = points[i];
            var grad = offCtx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, RADIUS);
            grad.addColorStop(0, 'rgba(255,255,255,0.13)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            offCtx.fillStyle = grad;
            offCtx.beginPath();
            offCtx.arc(pt.x, pt.y, RADIUS, 0, Math.PI * 2);
            offCtx.fill();

            if (pt.x - RADIUS < minX) minX = pt.x - RADIUS;
            if (pt.y - RADIUS < minY) minY = pt.y - RADIUS;
            if (pt.x + RADIUS > maxX) maxX = pt.x + RADIUS;
            if (pt.y + RADIUS > maxY) maxY = pt.y + RADIUS;
        }
        drawnCount = points.length;

        minX = Math.max(0, Math.floor(minX));
        minY = Math.max(0, Math.floor(minY));
        maxX = Math.min(canvasW, Math.ceil(maxX));
        maxY = Math.min(canvasH, Math.ceil(maxY));
        if (maxX <= minX || maxY <= minY) return null;

        return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    }

    // Re-colorizes one rect of the visible canvas from the current
    // accumulated density in that same rect of the offscreen canvas.
    function colorizeRect(rect) {
        var imgData = offCtx.getImageData(rect.x, rect.y, rect.w, rect.h);
        var data    = imgData.data;
        for (var j = 0; j < data.length; j += 4) {
            var a = data[j + 3];
            if (a === 0) continue;
            var lutIdx  = a * 4;
            data[j]     = LUT[lutIdx];
            data[j + 1] = LUT[lutIdx + 1];
            data[j + 2] = LUT[lutIdx + 2];
            data[j + 3] = Math.min(255, a * 2.2);
        }
        ctx.putImageData(imgData, rect.x, rect.y);
    }

    // ── Start / stop ─────────────────────────────────────────────────────────

    var active = false;
    var rafId  = null;

    function loop() {
        if (!active) return;
        ensureCanvasSize();
        var rect = drawNewPoints();
        if (rect) colorizeRect(rect);
        rafId = requestAnimationFrame(loop);
    }

    function start() {
        if (active) return;
        active = true;
        canvas.classList.add('active');
        loop();
    }

    function stop() {
        active = false;
        canvas.classList.remove('active');
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    window.HeatmapFX = { start: start, stop: stop };
}());
