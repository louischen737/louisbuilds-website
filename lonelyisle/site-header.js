(function () {
    var header = document.getElementById('site-header');
    if (!header) return;

    var inner = header.querySelector('.site-header__inner');
    var nav = header.querySelector('.site-header__nav');
    var threshold = 20;
    var ticking = false;
    var mq = window.matchMedia('(max-width: 768px)');

    function updateScroll() {
        header.classList.toggle('is-scrolled', window.scrollY > threshold);
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateScroll);
        }
    }

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!inner || !nav) return;

    var toggle = header.querySelector('.site-header__toggle');
    if (!toggle) {
        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'site-header__toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'site-header-nav');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.innerHTML =
            '<span class="site-header__toggle-icon" aria-hidden="true">' +
            '<span></span><span></span><span></span>' +
            '</span>';
        inner.insertBefore(toggle, nav);
    }

    if (!nav.id) nav.id = 'site-header-nav';

    function setOpen(open) {
        header.classList.toggle('is-nav-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    function closeNav() {
        setOpen(false);
    }

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(!header.classList.contains('is-nav-open'));
    });

    nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('click', function (e) {
        if (!header.classList.contains('is-nav-open')) return;
        if (!header.contains(e.target)) closeNav();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
    });

    function onViewportChange() {
        if (!mq.matches) closeNav();
    }

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onViewportChange);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(onViewportChange);
    }
})();
