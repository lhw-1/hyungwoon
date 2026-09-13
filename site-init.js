// site-init.js — populates index.html from the SITE global defined in content.js.

(function () {
    'use strict';
    if (typeof SITE === 'undefined') { return; }

    var EMAIL_ICON = '<svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
    var GITHUB_ICON = '<svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 98 96" aria-hidden="true"><path fill="currentColor" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>';

    function byId(name)         { return document.getElementById(name); }
    function setText(elId, txt) { var e = byId(elId); if (e) e.textContent = txt; }
    function setHTML(elId, htm) { var e = byId(elId); if (e) e.innerHTML = htm; }

    // ── Hero ──────────────────────────────────────────────────────────────────

    setText('hero-name', SITE.hero.name);
    setHTML('hero-role', SITE.hero.role);
    setHTML('hero-next', SITE.hero.next);

    var photo = document.querySelector('.hero-photo');
    if (photo) { photo.src = SITE.hero.photo; photo.alt = SITE.hero.name; }

    var contact = byId('hero-contact');
    if (contact) {
        contact.innerHTML =
            '<div class="hero-contact-row">' +
                '<span>' + EMAIL_ICON + SITE.hero.email + '</span>' +
                '<span>/</span>' +
                '<a href="' + SITE.hero.github + '" target="_blank" rel="noopener">' + GITHUB_ICON + 'GitHub</a>' +
                '<span>/</span>' +
                '<a href="' + SITE.hero.scholar + '" target="_blank" rel="noopener">Google Scholar</a>' +
                '<span>/</span>' +
                '<a href="' + SITE.hero.cv + '" download>CV</a>' +
            '</div>' +
            '<div class="hero-contact-row">' +
                '<a href="' + SITE.hero.medialab + '" target="_blank" rel="noopener">MIT Media Lab</a>' +
                '<span>/</span>' +
                '<a href="' + SITE.hero.ahlab + '" target="_blank" rel="noopener">NUS Augmented Human Lab</a>' +
            '</div>';
    }

    // ── News ──────────────────────────────────────────────────────────────────

    var newsList = byId('news-list');
    if (newsList) {
        newsList.innerHTML = SITE.news.map(function (item) {
            return '<li><span class="news-date">' + item.date + '</span>' +
                   '<span class="news-text">' + item.text + '</span></li>';
        }).join('');
    }

    // ── About ─────────────────────────────────────────────────────────────────

    var aboutContent = byId('about-content');
    if (aboutContent) {
        aboutContent.innerHTML = SITE.about.paragraphs.map(function (p) { return '<p>' + p + '</p>'; }).join('');
    }

    var asideEl = byId('about-aside');
    if (asideEl && SITE.about.aside && SITE.about.aside.length) {
        var asideItems = Array.isArray(SITE.about.aside) ? SITE.about.aside : [SITE.about.aside];
        var asideHtml = asideItems.map(function (p) { return '<p>' + p + '</p>'; }).join('');
        asideEl.innerHTML = '<details class="about-aside"><summary>More about me</summary>' + asideHtml + '</details>';
    }

    // ── Research ──────────────────────────────────────────────────────────────

    setHTML('research-lead', SITE.research.lead);

    var areasEl = byId('research-areas');
    if (areasEl) {
        areasEl.innerHTML = SITE.research.areas.map(function (area) {
            var paragraphs = Array.isArray(area.text) ? area.text : [area.text];
            var body = paragraphs.map(function (p) { return '<p>' + p + '</p>'; }).join('');
            return '<details class="research-area">' +
                   '<summary>' + area.title + '</summary>' +
                   body +
                   '</details>';
        }).join('');
    }

    // ── Projects ──────────────────────────────────────────────────────────────

    var projectList = byId('project-list');
    if (projectList) {
        projectList.innerHTML = SITE.projects.map(function (proj) {
            var tags = proj.tags.map(function (t) {
                return '<span class="tag">' + t + '</span>';
            }).join('');
            var url = 'projects/project.html?id=' + proj.slug;
            return '<div class="project-entry">' +
                '<div class="project-header-row">' +
                    '<a href="' + url + '" class="project-name">' + proj.name + '</a>' +
                    '<div class="project-tags">' + tags + '</div>' +
                '</div>' +
                '<p class="project-meta">' + proj.meta + '</p>' +
                '<p class="project-desc">' + proj.desc + '</p>' +
                '</div>';
        }).join('');
    }

    // ── Publications ──────────────────────────────────────────────────────────

    var pubList = byId('pub-list');
    if (pubList) {
        pubList.innerHTML = SITE.publications.map(function (pub) {
            var links = (pub.links || []).map(function (l) {
                return ' <a href="' + l.url + '" target="_blank" rel="noopener">[' + l.text + ']</a>';
            }).join('');
            var abstract = pub.abstract
                ? '<details class="pub-abstract"><summary>Abstract</summary><p>' + pub.abstract + '</p></details>'
                : '';
            return '<div class="pub-entry">' +
                '<p class="pub-title">' + pub.title + '</p>' +
                '<p class="pub-authors">' + pub.authors + '</p>' +
                '<p class="pub-venue">' + pub.venue + links + '</p>' +
                abstract +
                '</div>';
        }).join('');
    }

    // ── Footer ────────────────────────────────────────────────────────────────

    var footerEmail = byId('footer-email');
    if (footerEmail) {
        footerEmail.innerHTML = 'Hyungwoon Lee &middot; ' + SITE.footer.email;
    }
    setText('footer-updated', 'Last updated ' + SITE.footer.lastUpdated);

}());
