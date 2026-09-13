// adaptive-signal.js
//
// Scrolling time-series visualisation driven by real interaction data.
// Two channels scroll right-to-left as new samples arrive:
//   Ch 1  fast-reacting  — responds quickly to mouse / scroll activity
//   Ch 2  slow baseline  — smoothed long-term engagement level
//
// Sense  →  mouse velocity, scroll velocity
// Infer  →  fast + slow exponential smoothers
// Display →  ring-buffer drawn as left-scrolling time series

(function () {
    'use strict';

    if (typeof p5 === 'undefined') return;

    // ── Sensing ───────────────────────────────────────────────────────────────

    var sense = {
        mouseVel:      0,
        scrollVel:     0,
        lastMouseX:    0,
        lastMouseY:    0,
        lastMouseTime: 0,
        lastScrollY:   window.scrollY,
        lastScrollT:   performance.now(),
    };

    document.addEventListener('mousemove', function (e) {
        var now = performance.now();
        var dt  = now - sense.lastMouseTime;
        if (dt > 0 && dt < 120 && sense.lastMouseTime > 0) {
            var dx = e.clientX - sense.lastMouseX;
            var dy = e.clientY - sense.lastMouseY;
            sense.mouseVel = Math.min(Math.sqrt(dx * dx + dy * dy) / dt * 13, 1.0);
        }
        sense.lastMouseX    = e.clientX;
        sense.lastMouseY    = e.clientY;
        sense.lastMouseTime = now;
    }, { passive: true });

    document.addEventListener('scroll', function () {
        var now  = performance.now();
        var dt   = Math.max(now - sense.lastScrollT, 16);
        var dist = Math.abs(window.scrollY - sense.lastScrollY);
        sense.scrollVel   = Math.min(dist / dt * 7, 1.0);
        sense.lastScrollY = window.scrollY;
        sense.lastScrollT = now;
    }, { passive: true });

    // ── Inference ─────────────────────────────────────────────────────────────
    // Two independent smoothers with different time constants.
    // fast: rises quickly on activity, decays over ~1–2 s
    // slow: rises and falls much more gradually (long-term baseline)

    var infer = {
        fast:       0,
        slow:       0,
        frameCount: 0,
        phase:      'calibrating',
    };

    function updateArousal() {
        infer.frameCount++;
        var raw = Math.max(sense.mouseVel, sense.scrollVel);

        infer.fast += (raw - infer.fast) * (raw > infer.fast ? 0.08  : 0.013);
        infer.slow += (raw - infer.slow) * (raw > infer.slow ? 0.020 : 0.005);

        sense.mouseVel  *= 0.85;
        sense.scrollVel *= 0.88;
    }

    function resolvePhase() {
        if (infer.frameCount < 90) { infer.phase = 'calibrating'; return 'calibrating'; }
        var a  = infer.slow;
        var ph = infer.phase;
        if (ph === 'calibrating' || ph === 'steady') {
            if (a > 0.12) infer.phase = 'active';
        } else if (ph === 'active') {
            if (a < 0.06)  infer.phase = 'steady';
            else if (a > 0.35) infer.phase = 'elevated';
        } else if (ph === 'elevated') {
            if (a < 0.25)  infer.phase = 'active';
        }
        return infer.phase;
    }

    // ── Ring buffers ──────────────────────────────────────────────────────────
    // 500 samples. At SAMPLE_EVERY = 3 frames and ~60 fps that is one sample
    // every ~50 ms, giving roughly 25 seconds of scrolling history.

    var N_SAMPLES    = 500;
    var fastBuf      = new Array(N_SAMPLES).fill(0);
    var slowBuf      = new Array(N_SAMPLES).fill(0);
    var bufPtr       = 0;
    var frameTick    = 0;
    var SAMPLE_EVERY = 2;

    // ── Rendering ─────────────────────────────────────────────────────────────

    new p5(function (p) {

        p.setup = function () {
            var container = document.getElementById('signal-strip');
            if (!container) return;
            var cnv = p.createCanvas(container.offsetWidth, container.offsetHeight);
            cnv.parent('signal-strip');
            cnv.elt.style.cssText = 'position:absolute;top:0;left:0;z-index:0;pointer-events:none;';
            p.noFill();
        };

        p.draw = function () {
            p.clear();
            updateArousal();

            var calibFade = Math.min(infer.frameCount / 90, 1.0);

            frameTick++;
            if (frameTick >= SAMPLE_EVERY) {
                frameTick = 0;
                fastBuf[bufPtr] = infer.fast * calibFade;
                slowBuf[bufPtr] = infer.slow * calibFade;
                bufPtr = (bufPtr + 1) % N_SAMPLES;
            }

            var w = p.width;
            var h = p.height;

            // Ch 1: fast activity  — upper band, more opaque, taller swings
            drawChannel(p, w, h * 0.36, fastBuf, bufPtr, h * 0.22, 60);
            // Ch 2: slow baseline — lower band, quieter
            drawChannel(p, w, h * 0.68, slowBuf, bufPtr, h * 0.13, 38);

            setStatus(resolvePhase());
        };

        p.windowResized = function () {
            var container = document.getElementById('signal-strip');
            if (container) p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        };
    });

    // ── Draw ring buffer as scrolling time series ──────────────────────────────
    // Oldest sample → left edge. Newest sample → right edge.

    function drawChannel(p, w, yCtr, buf, ptr, maxAmp, alpha) {
        p.stroke(37, 99, 235, alpha);
        p.strokeWeight(1.25);
        p.beginShape();
        for (var i = 0; i < N_SAMPLES; i++) {
            var idx = (ptr + i) % N_SAMPLES;
            var x   = (i / (N_SAMPLES - 1)) * w;
            var y   = yCtr - buf[idx] * maxAmp;
            p.vertex(x, y);
        }
        p.endShape();
    }

    // ── Status readout ────────────────────────────────────────────────────────

    var _renderedPhase = '';
    var _mlLabel       = null;   // most recent ML label, or null if not yet available

    function setStatus(phase) {
        var dot   = document.getElementById('signal-dot');
        var label = document.getElementById('signal-label');
        if (!dot || !label) return;

        if (_mlLabel !== null) {
            // ML classifier is active — use its label + dot colour
            dot.dataset.phase = _mlLabel;
            label.textContent = _mlLabel;
            return;
        }

        // Fallback: heuristic phase labels
        if (phase === _renderedPhase) return;
        _renderedPhase = phase;
        dot.dataset.phase = phase;
        label.textContent = {
            calibrating: 'calibrating…',
            steady:      'steady state',
            active:      'active',
            elevated:    'elevated',
        }[phase] || phase;
    }

    // ── ML attention integration ──────────────────────────────────────────────
    // Listen for predictions from cursor-classifier.js (loaded on index.html).

    document.addEventListener('attention-update', function (e) {
        _mlLabel = e.detail.label;
        var dot  = document.getElementById('signal-dot');
        if (dot) dot.dataset.phase = _mlLabel;
        var label = document.getElementById('signal-label');
        if (label) label.textContent = _mlLabel;
    });

}());
