// project-render.js — reads from SITE global (content.js) and renders the project detail page.
// The project is identified by the ?id=<slug> query parameter.

(function () {
    'use strict';
    if (typeof SITE === 'undefined') { return; }

    var footerEmail = document.getElementById('footer-email');
    if (footerEmail) { footerEmail.innerHTML = 'Hyungwoon Lee &middot; ' + SITE.footer.email; }
    var footerUpdated = document.getElementById('footer-updated');
    if (footerUpdated) { footerUpdated.textContent = 'Last updated ' + SITE.footer.lastUpdated; }

    var slug = new URLSearchParams(location.search).get('id');
    var d = SITE.projects.find(function (p) { return p.slug === slug; });

    var main = document.getElementById('proj-main');
    if (!main) { return; }

    if (!d) {
        main.innerHTML = '<div style="padding:60px 0;color:#6b7280;font-size:0.95em;">Project not found.</div>';
        return;
    }

    document.title = d.name + ' — Hyungwoon Lee';

    var html = '';

    // Header
    html += '<div class="proj-header">' +
        '<h1>' + d.name + '</h1>' +
        '<p class="proj-meta-row">' + d.meta + '</p>' +
        '<div class="proj-tags">' +
        d.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') +
        '</div></div>';

    // Hero image
    if (d.image) {
        html += '<img src="' + d.image.src + '" alt="' + d.image.alt + '" class="proj-image">';
    }

    // Overview
    if (d.overview) {
        html += '<div class="content-section proj-overview"><h2>Overview</h2>' + d.overview + '</div>';
    }

    // Timeline
    if (d.timeline && d.timeline.length) {
        var items = d.timeline.map(function (item) {
            return '<div class="timeline-item">' +
                '<div class="timeline-date">' + item.date + '</div>' +
                '<div class="timeline-content">' + item.text + '</div>' +
                '</div>';
        }).join('');
        html += '<div class="content-section"><h2>Timeline</h2><div class="timeline">' + items + '</div></div>';
    }

    // Gallery
    if (d.gallery && d.gallery.length) {
        var imgs = d.gallery.map(function (img) {
            return '<img src="' + img.src + '" alt="' + img.alt + '">';
        }).join('');
        html += '<div class="content-section"><h2>Gallery</h2><div class="gallery">' + imgs + '</div></div>';
    }

    // Links
    if (d.links && d.links.length) {
        var btns = d.links.map(function (l) {
            return '<a href="' + l.url + '" class="proj-link-btn" target="_blank" rel="noopener">' + l.text + '</a>';
        }).join('');
        html += '<div class="content-section"><h2>Links</h2><div class="proj-links">' + btns + '</div></div>';
    }

    main.innerHTML = html;
}());
