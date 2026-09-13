// wiki-toggle.js
//
// "Wanna learn something new instead?" — an alternative reading mode.
// Toggling it on:
//   1. Wraps EVERY occurrence of each term in a curated keyword map (below)
//      in a link to a relevant page — a Wikipedia article for established
//      concepts, or an official project page for things (like specific ML
//      models) that don't have their own Wikipedia article. Repeats are
//      intentional: every "HCI" on the page gets its own link.
//   2. Reveals a purple hint line ("Click on the purple links...") and,
//      below it, a "...Or try a random topic instead" link — a plain link
//      to Special:Random, which redirects server-side, so no fetch is
//      needed for it.
//   3. Hovering (or focusing) any of the new links shows a small popover
//      with a title and description. For Wikipedia links this is fetched
//      live from Wikipedia's REST summary API and cached after the first
//      fetch per article; for official-page links it's a fixed description
//      supplied in the map below (no fetch — arbitrary external sites don't
//      offer a CORS-friendly summary endpoint to pull from).
//   4. RETARGET_MAP entries go a step further: instead of linkifying plain
//      text, they find EXISTING real links on the page (e.g. "MIT Media
//      Lab" -> media.mit.edu) whose visible text matches, and temporarily
//      repoint their href to the mapped page instead — same popover
//      treatment.
// Toggling off restores every scanned element to its pre-linkify HTML
// (which also puts every retargeted link's href back to normal), and hides
// the random-page link and any open popover.
//
// This same script runs on both index.html and projects/project.html — it
// only acts on elements matching SCAN_SELECTORS, so it's a no-op wherever
// those don't exist on a given page.
//
// TO REMOVE: delete this file, wiki-toggle.css, and (in index.html and
// projects/project.html) the <div id="wiki-panel">...</div> block, the
// <link> to the stylesheet, and the <script> tag for this file.

(function () {
    'use strict';

    var btn        = document.getElementById('wiki-toggle');
    var hint       = document.getElementById('wiki-hint');
    var randomLink = document.getElementById('wiki-random-link');
    if (!btn) return;

    // ── Curated keyword map ──────────────────────────────────────────────────
    // term  — exact text as it literally appears on this site (case-sensitive,
    //         matched whole-word/phrase, every occurrence).
    // wiki  — a Wikipedia article title. Verified directly against the
    //         Wikipedia API (checking for redirects and missing pages) before
    //         being added here.
    // -- or, for terms with no Wikipedia article (e.g. specific ML models) --
    // url + desc — link straight to the official project page, with a fixed
    //         popover description instead of a live Wikipedia fetch.
    var KEYWORD_MAP = [
        { term: 'XGBoost',   wiki: 'XGBoost' },
        { term: 'SVMs',      wiki: 'Support vector machine' },
        { term: 'CNN',       wiki: 'Convolutional neural network' },
        { term: 'SLAM',      wiki: 'Simultaneous localization and mapping' },
        { term: 'LLMs',      wiki: 'Large language model' },
        { term: 'LLM',       wiki: 'Large language model' },
        { term: 'EEG',       wiki: 'Electroencephalography' },
        { term: 'PPG',       wiki: 'Photoplethysmogram' },
        { term: 'HRV',       wiki: 'Heart rate variability' },
        { term: 'SpO2',      wiki: 'Oxygen saturation (medicine)' },
        { term: 'EDA',       wiki: 'Electrodermal activity' },
        { term: 'CBT',       wiki: 'Cognitive behavioral therapy' },
        { term: 'HCI',       wiki: 'Human–computer interaction' },
        { term: 'HAI',       wiki: 'Human–AI interaction' },
        { term: 'machine learning',                wiki: 'Machine learning' },
        { term: 'deep learning',                   wiki: 'Deep learning' },
        { term: 'reinforcement learning',          wiki: 'Reinforcement learning' },
        { term: 'self-supervised learning',        wiki: 'Self-supervised learning' },
        { term: 'computer vision',                 wiki: 'Computer vision' },
        { term: 'natural language processing',     wiki: 'Natural language processing' },
        { term: 'transformer architectures',       wiki: 'Transformer (deep learning)' },
        { term: 'abstract syntax trees',            wiki: 'Abstract syntax tree' },
        { term: 'clinical psychology',              wiki: 'Clinical psychology' },
        { term: 'cognitive psychology',             wiki: 'Cognitive psychology' },
        { term: 'Mixed Reality',                    wiki: 'Augmented reality' },
        { term: 'Boston Dynamics',                  wiki: 'Boston Dynamics' },
        { term: 'bagpipes',                         wiki: 'Bagpipes' },
        { term: 'FL Studio',                        wiki: 'FL Studio' },
        { term: 'NUS',                               wiki: 'National University of Singapore' },
        { term: 'AI',                                wiki: 'Artificial intelligence' },
        { term: 'CS1101S: Programming Methodology',  wiki: 'Structure and Interpretation of Computer Programs' },
        { term: 'graduate student',                  wiki: 'Postgraduate education' },
        { term: 'cognitive augmentation',            wiki: 'Intelligence amplification' },
        { term: 'learning',                          wiki: 'Learning' },
        { term: 'teaching',                          wiki: 'Teaching' },
        { term: 'Computer Science',                  wiki: 'Computer science' },
        { term: 'Psychology',                        wiki: 'Psychology' },
        { term: 'Singapore',                         wiki: 'Singapore' },
        { term: 'IB',                                wiki: 'International Baccalaureate' },
        { term: 'Tchaikovsky',                       wiki: 'Pyotr Ilyich Tchaikovsky' },
        { term: 'Shostakovich',                      wiki: 'Dmitri Shostakovich' },
        { term: 'Hamlet',                            wiki: 'Hamlet' },
        { term: 'origami',                           wiki: 'Origami' },

        // About: roles and background
        { term: 'clinical',                          wiki: 'Clinical psychology' },
        { term: 'undergraduate',                     wiki: 'Undergraduate education' },
        { term: 'research',                          wiki: 'Research' },
        { term: 'engineer',                          wiki: 'Engineer' },
        { term: 'developer',                         wiki: 'Programmer' },
        { term: 'project lead',                      wiki: 'Project management' },

        // Research lead + "HCI and Cognitive Augmentation"
        { term: 'context-aware',                     wiki: 'Context awareness' },
        { term: 'multimodal',                        wiki: 'Multimodal interaction' },
        { term: 'technology',                        wiki: 'Technology' },
        { term: 'wearable',                          wiki: 'Wearable technology' },
        { term: 'sensing devices',                   wiki: 'Sensor' },
        { term: 'cognitive sciences',                wiki: 'Cognitive science' },
        { term: 'critical thinking',                 wiki: 'Critical thinking' },
        { term: 'interdisciplinary',                 wiki: 'Interdisciplinarity' },
        { term: 'domains',                           wiki: 'Domain knowledge' },
        { term: 'information systems',               wiki: 'Information system' },
        { term: 'interaction design',                wiki: 'Interaction design' },
        { term: 'assistive technology',               wiki: 'Assistive technology' },
        { term: 'virtual reality',                    wiki: 'Virtual reality' },
        { term: 'sensors',                            wiki: 'Sensor' },
        { term: 'haptics',                            wiki: 'Haptic technology' },
        { term: 'signal processing',                  wiki: 'Signal processing' },
        { term: 'Signal processing',                  wiki: 'Signal processing' },  // sentence-initial capitalization
        { term: 'affective psychology',               wiki: 'Affective science' },
        { term: 'drone',                              wiki: 'Unmanned aerial vehicle' },
        { term: 'communications',                     wiki: 'Communication' },
        { term: 'new media',                          wiki: 'New media' },
        { term: 'UI/UX design',                       wiki: 'User experience design' },
        { term: 'embedded systems',                   wiki: 'Embedded system' },
        { term: 'pedagogy',                           wiki: 'Pedagogy' },
        { term: 'education',                          wiki: 'Education' },
        { term: 'human augmentation',                 wiki: 'Human enhancement' },

        // "Cognitive Sciences, Psychology, and Education"
        { term: 'Ph.D.',                              wiki: 'Doctor of Philosophy' },
        { term: 'lecturer',                           wiki: 'Lecturer' },
        { term: 'mental health',                      wiki: 'Mental health' },
        { term: 'mental models',                      wiki: 'Mental model' },

        // "Biosensing and Signal Processing"
        { term: 'acoustics',                          wiki: 'Acoustics' },
        { term: 'eye trackers',                       wiki: 'Eye tracking' },
        { term: 'respiratory rate',                   wiki: 'Respiratory rate' },
        { term: 'biofeedback',                        wiki: 'Biofeedback' },

        // About aside ("more about me")
        { term: 'music',                              wiki: 'Music' },
        { term: 'video game music',                   wiki: 'Video game music' },
        { term: 'video games',                        wiki: 'Video game' },
        { term: 'video game',                         wiki: 'Video game' },
        { term: 'digital art',                        wiki: 'Digital art' },
        { term: 'storywriting',                       wiki: 'Creative writing' },
        { term: 'cooking',                            wiki: 'Cooking' },
        { term: 'films',                              wiki: 'Film' },
        { term: 'cinematography',                     wiki: 'Cinematography' },
        { term: 'history',                            wiki: 'History' },
        { term: 'mythology',                          wiki: 'Myth' },
        { term: 'philosophy',                         wiki: 'Philosophy' },
        { term: 'narrative',                          wiki: 'Narrative' },

        // Project descriptions & publication abstracts
        { term: 'HMD',                                wiki: 'Head-mounted display' },
        { term: 'recommendation systems',             wiki: 'Recommender system' },
        { term: 'neural network',                     wiki: 'Neural network (machine learning)' },
        { term: 'smartwatch',                         wiki: 'Smartwatch' },
        { term: 'heart rate',                         wiki: 'Heart rate' },
        { term: 'sleep',                              wiki: 'Sleep' },
        { term: 'well-being',                         wiki: 'Well-being' },
        { term: 'wellbeing',                          wiki: 'Well-being' },
        { term: 'avatar',                             wiki: 'Avatar (computing)' },
        { term: 'guide dog',                          wiki: 'Guide dog' },
        { term: 'visually impaired',                  wiki: 'Visual impairment' },
        { term: 'navigation',                         wiki: 'Navigation' },
        { term: 'startup',                            wiki: 'Startup company' },
        { term: 'open-source',                        wiki: 'Open-source software' },
        { term: 'CLI',                                wiki: 'Command-line interface' },
        { term: 'Markdown',                           wiki: 'Markdown' },
        { term: 'programming',                        wiki: 'Computer programming' },
        { term: 'project manager',                    wiki: 'Project management' },
        { term: 'stress',                             wiki: 'Stress (biology)' },

        // No Wikipedia article — link to the official project page instead.
        {
            term: 'Mask2Former',
            url:  'https://bowenc0221.github.io/mask2former/',
            desc: 'A universal image segmentation architecture supporting panoptic, instance, and semantic segmentation.',
        },
        {
            term: 'Segment Anything (SAM)',
            url:  'https://segment-anything.com/',
            desc: "Meta AI's foundation model for zero-shot object segmentation from image prompts.",
        },
        {
            // Bare acronym — the robot-guide-dog homepage card text says
            // just "SAM", not the full "Segment Anything (SAM)" phrase above.
            term: 'SAM',
            url:  'https://segment-anything.com/',
            desc: "Meta AI's foundation model for zero-shot object segmentation from image prompts.",
        },
    ];

    // ── Retarget map ─────────────────────────────────────────────────────────
    // These don't scan plain text — they find EXISTING <a> elements on the
    // page whose full (trimmed) visible text matches `term` exactly, and
    // swap their href to `wiki` for as long as the mode is active. The
    // link's original href is restored automatically on toggle-off, since
    // it's part of the same innerHTML snapshot/revert used for everything
    // else.
    var RETARGET_MAP = [
        { term: 'MIT Media Lab',                         wiki: 'MIT Media Lab' },
        { term: 'National University of Singapore (NUS)', wiki: 'National University of Singapore' },
    ];

    // Elements to scan — page body copy only. Deliberately excludes nav,
    // tags, meta lines, and footer so links only ever appear in prose.
    // (Selectors that don't exist on the current page simply match nothing.)
    var SCAN_SELECTORS = [
        // index.html
        '#about-content p',
        '#about-aside p',
        '#research-lead',
        '#research-areas .research-area > p',
        '#project-list .project-desc',
        '#pub-list .pub-abstract p',
        // projects/project.html
        '#proj-main .proj-overview p',
        '#proj-main .proj-overview li',
    ].join(',');

    function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    // Each entry gets a unique cache key (for the hover popover): the
    // Wikipedia title, or the URL for official-page links.
    KEYWORD_MAP.forEach(function (e) { e.key = e.wiki || e.url; });
    RETARGET_MAP.forEach(function (e) { e.key = e.wiki || e.url; });

    var RETARGET_TERM_ENTRY = {};
    RETARGET_MAP.forEach(function (e) { RETARGET_TERM_ENTRY[e.term] = e; });

    var TERM_ENTRY = {};
    // Sorted longest-term-first so e.g. "clinical psychology" matches as a
    // whole before the standalone "clinical" alternative gets a chance to.
    var terms = KEYWORD_MAP.slice().sort(function (a, b) { return b.term.length - a.term.length; });
    terms.forEach(function (e) { TERM_ENTRY[e.term] = e; });
    // Lookaround (not \b) so terms ending in punctuation (e.g. "(SAM)") still
    // match correctly — \b requires a word/non-word transition, which fails
    // when both the last matched char and the next char are non-word (e.g.
    // ")" followed by a space).
    var COMBINED_RE = new RegExp(
        '(?<![A-Za-z0-9_])(' + terms.map(function (e) { return escapeRegex(e.term); }).join('|') + ')(?![A-Za-z0-9_])',
        'g'
    );

    function encodeWikiTitle(title) {
        return encodeURIComponent(title.replace(/ /g, '_'));
    }

    function hrefFor(entry) {
        return entry.wiki ? 'https://en.wikipedia.org/wiki/' + encodeWikiTitle(entry.wiki) : entry.url;
    }

    // ── Linkify ──────────────────────────────────────────────────────────────

    var snapshots = [];   // { el, html } — for reverting on toggle-off
    var active    = false;

    function isInsideAnchor(node, boundary) {
        while (node && node !== boundary) {
            if (node.nodeName === 'A') return true;
            node = node.parentNode;
        }
        return false;
    }

    function linkifyTextNode(textNode) {
        var text = textNode.nodeValue;
        COMBINED_RE.lastIndex = 0;
        var m = COMBINED_RE.exec(text);
        if (!m) return false;

        var frag = document.createDocumentFragment();
        var lastIndex = 0;

        while (m) {
            var entry = TERM_ENTRY[m[1]];
            frag.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));

            var a = document.createElement('a');
            a.className = 'wiki-link';
            a.href = hrefFor(entry);
            a.target = '_blank';
            a.rel = 'noopener';
            a.dataset.key = entry.key;
            a.textContent = m[1];
            attachPopoverHandlers(a);
            frag.appendChild(a);

            lastIndex = COMBINED_RE.lastIndex;
            m = COMBINED_RE.exec(text);
        }

        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        textNode.parentNode.replaceChild(frag, textNode);
        return true;
    }

    function linkifyElement(el) {
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        var textNodes = [];
        var node;
        while ((node = walker.nextNode())) {
            if (isInsideAnchor(node.parentNode, el)) continue;
            textNodes.push(node);
        }
        var changed = false;
        textNodes.forEach(function (tn) {
            if (linkifyTextNode(tn)) changed = true;
        });
        return changed;
    }

    // Retargets existing <a> elements (within el) whose full trimmed text
    // matches a RETARGET_MAP entry, swapping their href for as long as the
    // mode is active. Does not touch anchors that don't match.
    function swapExistingLinks(el) {
        var anchors = el.querySelectorAll('a');
        var changed = false;
        anchors.forEach(function (a) {
            var entry = RETARGET_TERM_ENTRY[a.textContent.trim()];
            if (!entry) return;
            a.href = hrefFor(entry);
            a.classList.add('wiki-link');
            a.dataset.key = entry.key;
            attachPopoverHandlers(a);
            changed = true;
        });
        return changed;
    }

    function activate() {
        active = true;
        btn.setAttribute('aria-pressed', 'true');
        if (hint) hint.hidden = false;
        if (randomLink) randomLink.hidden = false;

        var els = document.querySelectorAll(SCAN_SELECTORS);
        els.forEach(function (el) {
            var originalHTML = el.innerHTML;
            var swapped   = swapExistingLinks(el);
            var linkified = linkifyElement(el);
            if (swapped || linkified) {
                snapshots.push({ el: el, html: originalHTML });
            }
        });
    }

    function deactivate() {
        active = false;
        btn.setAttribute('aria-pressed', 'false');
        if (hint) hint.hidden = true;
        if (randomLink) randomLink.hidden = true;
        hidePopover();
        snapshots.forEach(function (s) { s.el.innerHTML = s.html; });
        snapshots = [];
    }

    btn.addEventListener('click', function () {
        if (active) { deactivate(); } else { activate(); }
    });

    // ── Hover/focus preview popover ───────────────────────────────────────────

    var popoverEl    = null;
    var popoverCache = {};   // key -> { title, description }

    var KEY_ENTRY = {};
    KEYWORD_MAP.forEach(function (e) { KEY_ENTRY[e.key] = e; });
    RETARGET_MAP.forEach(function (e) { KEY_ENTRY[e.key] = e; });

    function ensurePopover() {
        if (popoverEl) return popoverEl;
        popoverEl = document.createElement('div');
        popoverEl.id = 'wiki-popover';
        popoverEl.setAttribute('role', 'tooltip');
        popoverEl.hidden = true;
        popoverEl.innerHTML = '<div class="wiki-pop-title"></div><div class="wiki-pop-body"></div>';
        document.body.appendChild(popoverEl);
        return popoverEl;
    }

    function positionPopover(pop, anchorEl) {
        var rect = anchorEl.getBoundingClientRect();
        pop.style.left = '-9999px';
        pop.style.top  = '-9999px';
        pop.hidden = false;
        var popRect = pop.getBoundingClientRect();

        var left = rect.left;
        var maxLeft = window.innerWidth - popRect.width - 12;
        if (left > maxLeft) left = Math.max(12, maxLeft);

        var top = rect.bottom + 8;
        if (top + popRect.height > window.innerHeight - 12) {
            top = rect.top - popRect.height - 8;
            if (top < 12) top = 12;
        }

        pop.style.left = left + 'px';
        pop.style.top  = top + 'px';
    }

    function renderPopover(pop, key, info) {
        if (pop.dataset.currentKey !== key) return; // hover moved on since fetch started
        pop.querySelector('.wiki-pop-title').textContent = info.title;
        pop.querySelector('.wiki-pop-body').textContent  = info.description || 'No preview available.';
    }

    function showPopover(a) {
        var pop   = ensurePopover();
        var key   = a.dataset.key;
        var entry = KEY_ENTRY[key];
        pop.dataset.currentKey = key;
        pop.querySelector('.wiki-pop-title').textContent = entry.wiki || entry.term;

        if (popoverCache[key]) {
            pop.querySelector('.wiki-pop-body').textContent = popoverCache[key].description || 'No preview available.';
            positionPopover(pop, a);
            return;
        }

        // Official-page link: fixed description, no fetch.
        if (!entry.wiki) {
            var linkInfo = { title: entry.term, description: entry.desc };
            popoverCache[key] = linkInfo;
            pop.querySelector('.wiki-pop-body').textContent = linkInfo.description;
            positionPopover(pop, a);
            return;
        }

        // Wikipedia link: fetch the live summary.
        pop.querySelector('.wiki-pop-body').textContent = 'Loading…';
        positionPopover(pop, a);

        fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeWikiTitle(entry.wiki))
            .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
            .then(function (data) {
                var info = { title: data.title || entry.wiki, description: data.description || (data.extract || '').slice(0, 160) };
                popoverCache[key] = info;
                renderPopover(pop, key, info);
            })
            .catch(function () {
                var info = { title: entry.wiki, description: 'Preview unavailable.' };
                popoverCache[key] = info;
                renderPopover(pop, key, info);
            });
    }

    function hidePopover() {
        if (popoverEl) popoverEl.hidden = true;
    }

    function attachPopoverHandlers(a) {
        a.addEventListener('mouseenter', function () { showPopover(a); });
        a.addEventListener('mouseleave', hidePopover);
        a.addEventListener('focus', function () { showPopover(a); });
        a.addEventListener('blur', hidePopover);
    }

}());
