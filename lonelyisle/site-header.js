(function () {
    var header = document.getElementById('site-header');
    if (!header) return;

    var threshold = 20;
    var ticking = false;

    function update() {
        header.classList.toggle('is-scrolled', window.scrollY > threshold);
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
})();
