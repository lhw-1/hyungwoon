// fact-fx.js — a button (below the Wikipedia-mode toggle) that shows a
// random fact (from the local pool in facts.js) in the box below itself;
// clicking the box again dismisses it. Fully local — no external API, no
// key, nothing that can fail or rate-limit. (The existing wiki-toggle.js
// already provides a "random Wikipedia article" link, so this doesn't
// duplicate one.)
//
// TO REMOVE: delete this file, facts.js, fact-fx.css, and (in index.html)
// the <button id="fact-toggle">, the <div id="fact-box">, the <link> to
// the stylesheet, and the <script> tags for this file and facts.js.

(function () {
    'use strict';

    var btn = document.getElementById('fact-toggle');
    var box = document.getElementById('fact-box');
    if (!btn || !box) { return; }

    function randomFact() {
        if (typeof FACTS === 'undefined' || !FACTS.length) { return 'No facts loaded.'; }
        return FACTS[Math.floor(Math.random() * FACTS.length)];
    }

    btn.addEventListener('click', function () {
        box.textContent = randomFact();
        box.hidden = false;
    });

    box.addEventListener('click', function () {
        box.hidden = true;
    });
}());
