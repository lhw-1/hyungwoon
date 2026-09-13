// cursor-classifier.js
//
// Real-time attention classifier driven by cursor-movement features.
// Loads the XGBoost model trained on the Attentive Cursor Dataset and runs
// inference on a rolling window of mousemove / click events.
//
// Usage (after loading):
//   CursorClassifier.init('ml/attention_model_browser.json', 'ml/attention_model_xgb.json')
//     .then(function () { /* ready */ });
//
// Fires a CustomEvent on document:
//   document.addEventListener('attention-update', function (e) {
//       // e.detail = { label: 'focused'|'engaged'|'scanning', confidence: 0.0–1.0 }
//   });
//
// Features extracted here must exactly match FEATURE_NAMES in train_attention_classifier.py.

var CursorClassifier = (function () {
    'use strict';

    // ── Config ────────────────────────────────────────────────────────────────

    var WINDOW_MS       = 20000;  // rolling event buffer length (ms)
    var PREDICT_EVERY   = 8000;   // run inference every N ms
    var MIN_EVENTS      = 5;      // skip window if too few moves
    var PAUSE_VEL_THRESH = 0.1;   // px/ms; below this = paused

    // Probability thresholds → label
    var THRESH_FOCUSED  = 0.60;
    var THRESH_ENGAGED  = 0.47;

    // ── State ─────────────────────────────────────────────────────────────────

    var _scaler = null;
    var _trees  = null;
    var _baseScore = 0;
    var _featureNames = [];
    var _ready  = false;
    var _events = [];  // { ts, x, y, isClick }
    var _timer  = null;

    // ── Model loading ─────────────────────────────────────────────────────────

    function init(browserJsonUrl, xgbJsonUrl) {
        return fetch(browserJsonUrl)
            .then(function (r) { return r.json(); })
            .then(function (meta) {
                _scaler       = meta.scaler;
                _baseScore    = meta.base_score_margin || 0;
                _featureNames = meta.feature_names;
                return fetch(xgbJsonUrl);
            })
            .then(function (r) { return r.json(); })
            .then(function (trees) {
                _trees = trees;
                _ready = true;
                _startListeners();
                _timer = setInterval(_runInference, PREDICT_EVERY);
            })
            .catch(function (err) {
                // Model not found (local dev / file:// protocol) — silently skip
                console.warn('[CursorClassifier] could not load model:', err.message);
            });
    }

    // ── Event collection ──────────────────────────────────────────────────────

    function _startListeners() {
        document.addEventListener('mousemove', function (e) {
            _events.push({ ts: performance.now(), x: e.clientX, y: e.clientY, isClick: false });
        }, { passive: true });

        document.addEventListener('click', function (e) {
            _events.push({ ts: performance.now(), x: e.clientX, y: e.clientY, isClick: true });
        }, { passive: true });
    }

    function _pruneWindow() {
        var cutoff = performance.now() - WINDOW_MS;
        var i = 0;
        while (i < _events.length && _events[i].ts < cutoff) i++;
        if (i > 0) _events = _events.slice(i);
    }

    // ── Feature extraction ────────────────────────────────────────────────────
    // Mirrors extract_features() in train_attention_classifier.py.

    function _extractFeatures() {
        _pruneWindow();
        var moves = _events.filter(function (e) { return !e.isClick; });
        if (moves.length < MIN_EVENTS) return null;

        var n = moves.length;
        var ts = moves.map(function (e) { return e.ts; });
        var xs = moves.map(function (e) { return e.x; });
        var ys = moves.map(function (e) { return e.y; });

        var dt = [], dx = [], dy = [], dists = [], vels = [], angles = [];
        for (var i = 1; i < n; i++) {
            var dti  = Math.max(ts[i] - ts[i-1], 1);
            var dxi  = xs[i] - xs[i-1];
            var dyi  = ys[i] - ys[i-1];
            var dist = Math.sqrt(dxi*dxi + dyi*dyi);
            dt.push(dti);
            dx.push(dxi);
            dy.push(dyi);
            dists.push(dist);
            vels.push(dist / dti);
            angles.push(Math.atan2(dyi, dxi));
        }

        if (vels.length === 0) return null;

        var sumVel = 0, maxVel = 0;
        for (var j = 0; j < vels.length; j++) { sumVel += vels[j]; if (vels[j] > maxVel) maxVel = vels[j]; }
        var meanVel = sumVel / vels.length;

        var sortedVels = vels.slice().sort(function (a, b) { return a - b; });
        var mid = Math.floor(sortedVels.length / 2);
        var medianVel = sortedVels.length % 2 === 1
            ? sortedVels[mid]
            : (sortedVels[mid-1] + sortedVels[mid]) / 2;

        var varVel = 0;
        for (var k = 0; k < vels.length; k++) varVel += (vels[k] - meanVel) * (vels[k] - meanVel);
        var stdVel = Math.sqrt(varVel / vels.length);

        // Direction changes
        var angleDiffs = [];
        for (var a = 1; a < angles.length; a++) {
            var diff = Math.abs(angles[a] - angles[a-1]);
            if (diff > Math.PI) diff = 2 * Math.PI - diff;
            angleDiffs.push(diff);
        }
        var meanAngleDiff = 0, dirChanges = 0;
        if (angleDiffs.length > 0) {
            var sumAd = 0;
            for (var b = 0; b < angleDiffs.length; b++) {
                sumAd += angleDiffs[b];
                if (angleDiffs[b] > Math.PI / 4) dirChanges++;
            }
            meanAngleDiff = sumAd / angleDiffs.length;
        }

        // Pauses
        var nPauses = 0;
        for (var p = 0; p < vels.length; p++) { if (vels[p] < PAUSE_VEL_THRESH) nPauses++; }

        // Spatial extent
        var xMin = xs[0], xMax = xs[0], yMin = ys[0], yMax = ys[0];
        for (var s = 1; s < xs.length; s++) {
            if (xs[s] < xMin) xMin = xs[s]; if (xs[s] > xMax) xMax = xs[s];
            if (ys[s] < yMin) yMin = ys[s]; if (ys[s] > yMax) yMax = ys[s];
        }
        var xRange = xMax - xMin, yRange = yMax - yMin;

        var sumX = 0, sumY = 0;
        for (var r = 0; r < n; r++) { sumX += xs[r]; sumY += ys[r]; }
        var meanX = sumX / n, meanY = sumY / n;
        var varX = 0, varY = 0;
        for (var q = 0; q < n; q++) {
            varX += (xs[q] - meanX) * (xs[q] - meanX);
            varY += (ys[q] - meanY) * (ys[q] - meanY);
        }
        var stdX = Math.sqrt(varX / n), stdY = Math.sqrt(varY / n);

        var totalDist = 0;
        for (var d = 0; d < dists.length; d++) totalDist += dists[d];

        var nClicks = _events.filter(function (e) { return e.isClick; }).length;
        var duration = ts[n-1] - ts[0];

        // Return in FEATURE_NAMES order
        return [
            n,                           // n_moves
            duration,                    // duration_ms
            totalDist,                   // total_dist
            meanVel,                     // mean_vel
            stdVel,                      // std_vel
            maxVel,                      // max_vel
            medianVel,                   // median_vel
            meanAngleDiff,               // mean_angle_diff
            dirChanges,                  // dir_changes
            nPauses,                     // n_pauses
            nPauses / vels.length,       // pause_ratio
            xRange,                      // x_range
            yRange,                      // y_range
            xRange * yRange,             // bbox_area
            stdX,                        // std_x
            stdY,                        // std_y
            nClicks,                     // n_clicks
        ];
    }

    // ── Standardise ───────────────────────────────────────────────────────────

    function _standardise(rawFeatures) {
        var scaled = new Array(rawFeatures.length);
        for (var i = 0; i < rawFeatures.length; i++) {
            scaled[i] = (rawFeatures[i] - _scaler.mean[i]) / _scaler.scale[i];
        }
        return scaled;
    }

    // ── XGBoost inference ─────────────────────────────────────────────────────
    // Trees are in the dump_model() nested format.
    // Leaf values accumulate as log-odds; apply sigmoid at the end.

    function _traverseTree(node, features) {
        if ('leaf' in node) return node.leaf;
        var fi  = parseInt(node.split.slice(1), 10);  // "f15" → 15
        var val = features[fi];
        var nextId = (val < node.split_condition) ? node.yes : node.no;
        for (var c = 0; c < node.children.length; c++) {
            if (node.children[c].nodeid === nextId) {
                return _traverseTree(node.children[c], features);
            }
        }
        return 0;
    }

    function _sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

    function _predictProba(scaledFeatures) {
        var score = _baseScore;
        for (var t = 0; t < _trees.length; t++) {
            score += _traverseTree(_trees[t], scaledFeatures);
        }
        return _sigmoid(score);
    }

    // ── Inference + dispatch ──────────────────────────────────────────────────

    function _runInference() {
        if (!_ready) return;
        var raw = _extractFeatures();
        if (raw === null) return;

        var scaled     = _standardise(raw);
        var confidence = _predictProba(scaled);

        var label;
        if (confidence >= THRESH_FOCUSED) {
            label = 'focused';
        } else if (confidence >= THRESH_ENGAGED) {
            label = 'engaged';
        } else {
            label = 'scanning';
        }

        document.dispatchEvent(new CustomEvent('attention-update', {
            detail: { label: label, confidence: confidence },
        }));
    }

    // ── Public API ────────────────────────────────────────────────────────────

    return { init: init };

}());
