(function () {
    const video = document.querySelector(".hero-video");
    if (!video) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const source = video.querySelector("source");
    const videoSrc = source ? source.getAttribute("src") : "";

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.controls = false;
    video.removeAttribute("controls");

    function tryPlay() {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {});
        }
    }

    function loadAndPlay() {
        if (source && videoSrc && !source.getAttribute("src")) {
            source.setAttribute("src", videoSrc);
            video.load();
        }
        tryPlay();
    }

    if (isMobile) {
        video.preload = "none";
        if (source && videoSrc) {
            source.removeAttribute("src");
        }

        requestAnimationFrame(function () {
            setTimeout(loadAndPlay, 1200);
        });

        window.addEventListener(
            "touchstart",
            function onTouch() {
                loadAndPlay();
                window.removeEventListener("touchstart", onTouch);
            },
            { passive: true, once: true }
        );
    } else {
        video.preload = "metadata";
        tryPlay();
    }

    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) tryPlay();
    });
})();
