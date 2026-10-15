// cursor-toggle.js — the "Cursor Heatmap" button turns the cursor heatmap
// (heatmap-toggle.js, which exposes start()/stop()) on and off. The cursor
// itself is the normal system cursor; the heatmap is off by default.
//
// TO REMOVE: see the header comment in heatmap-toggle.js.

(function () {
    'use strict';
    var btn = document.getElementById('heatmap-toggle');
    if (!btn || typeof HeatmapFX === 'undefined') { return; }

    var heatmapOn = false;

    function apply() {
        btn.setAttribute('aria-pressed', String(heatmapOn));
        if (heatmapOn) {
            HeatmapFX.start();
        } else {
            HeatmapFX.stop();
        }
    }

    btn.addEventListener('click', function () {
        heatmapOn = !heatmapOn;
        apply();
    });
}());
