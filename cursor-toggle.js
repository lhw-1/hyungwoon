// cursor-toggle.js — the "Cursor Heatmap" button switches the ambient
// cursor effect between an ink-brush trail (default, brush-fx.js) and the
// cursor heatmap (heatmap-toggle.js, adapted to expose start()/stop()
// instead of owning this button itself).
//
// TO REMOVE: see the header comment in heatmap-toggle.js.

(function () {
    'use strict';
    var btn = document.getElementById('heatmap-toggle');
    if (!btn || typeof BrushFX === 'undefined' || typeof HeatmapFX === 'undefined') { return; }

    var heatmapOn = false;

    function apply() {
        btn.setAttribute('aria-pressed', String(heatmapOn));
        if (heatmapOn) {
            BrushFX.stop();
            HeatmapFX.start();
        } else {
            HeatmapFX.stop();
            BrushFX.start();
        }
    }

    btn.addEventListener('click', function () {
        heatmapOn = !heatmapOn;
        apply();
    });

    BrushFX.start(); // ink-brush trail is the default ambient effect
}());
