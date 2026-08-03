(function () {
    var MODES = [
        {
            title: "Ellidaey",
            subtitle: "Listening to the island",
            compact: "Ellidaey",
            thumb: "images/island-ellidaey.png"
        },
        {
            title: "Ellidaey",
            subtitle: "Crackling fire at the lodge",
            compact: "Lodge",
            thumb: "images/island-ellidaey.png"
        },
        {
            title: "Lighthouse Radio",
            subtitle: "Polar winds tracing the sleeping dark.",
            compact: "Radio",
            thumb: "icon.png"
        }
    ];

    function prefersReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function applyMode(root, mode) {
        var title = root.querySelector("[data-la-title]");
        var subtitle = root.querySelector("[data-la-subtitle]");
        var compact = root.querySelector("[data-la-compact]");
        var thumbs = root.querySelectorAll("[data-la-thumb]");

        if (title) title.textContent = mode.title;
        if (compact) compact.textContent = mode.compact;
        thumbs.forEach(function (img) {
            img.src = mode.thumb;
        });

        if (!subtitle) return;

        subtitle.textContent = mode.subtitle;
        subtitle.classList.remove("is-fading");
    }

    function setScene(root, sceneName) {
        root.querySelectorAll("[data-live-scene]").forEach(function (scene) {
            scene.classList.toggle("is-active", scene.getAttribute("data-live-scene") === sceneName);
        });
    }

    function initDemo(root) {
        var modeIndex = 0;
        var showLock = false;

        applyMode(root, MODES[modeIndex]);
        setScene(root, "home");

        if (prefersReducedMotion()) {
            setScene(root, "lock");
            return;
        }

        var timer = window.setInterval(function () {
            if (document.hidden) return;

            showLock = !showLock;

            if (showLock) {
                setScene(root, "lock");
            } else {
                modeIndex = (modeIndex + 1) % MODES.length;
                applyMode(root, MODES[modeIndex]);
                setScene(root, "home");
            }
        }, 5600);

        document.addEventListener("visibilitychange", function () {
            if (!document.hidden) {
                applyMode(root, MODES[modeIndex]);
                setScene(root, showLock ? "lock" : "home");
            }
        });

        root._liveActivityTimer = timer;
    }

    document.querySelectorAll("[data-live-activity-demo]").forEach(initDemo);
})();
