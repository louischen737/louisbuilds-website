(function () {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof ScrollToPlugin === "undefined") {
        document.documentElement.classList.remove("js");
        return;
    }

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    gsap.defaults({ ease: "expo.out", duration: 0.85 });

    const HEADER_OFFSET = 72;
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function scrollToTarget(target, offsetY) {
        if (!target) return;
        const offset = offsetY == null ? HEADER_OFFSET : offsetY;
        const scroller = document.scrollingElement || document.documentElement;

        if (reduceMotionQuery.matches) {
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo(0, Math.max(0, top));
            return;
        }

        gsap.to(scroller, {
            duration: 0.9,
            ease: "power3.inOut",
            overwrite: true,
            scrollTo: {
                y: target,
                offsetY: offset,
                autoKill: false
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || href === "#") return;
            const el = document.querySelector(href);
            if (!el) return;
            event.preventDefault();
            scrollToTarget(el);
        });
    });

    gsap.to("#progressBar", {
        scaleX: 1,
        ease: "none",
        transformOrigin: "left center",
        scrollTrigger: {
            start: 0,
            end: "max",
            scrub: 0.35
        }
    });

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([
            ".hero-title",
            ".hero-char",
            ".hero-lede",
            ".hero .explore-btn",
            ".products-section-head",
            ".app-chapter-visual",
            ".app-chapter-copy",
            ".community-intro",
            ".community-tile",
            ".community-actions",
            ".community-tagline",
            ".journal-section-head",
            ".journal-featured",
            ".journal-item",
            ".journal-follow-cta",
            ".site-cta-title",
            ".cta-char"
        ], { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: "transform,filter" });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".products-section-head", { y: 24, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            scrollTrigger: {
                trigger: "#products",
                start: "top 82%",
                once: true
            }
        });

        gsap.fromTo(".community-intro", { y: 24, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            scrollTrigger: {
                trigger: "#community",
                start: "top 80%",
                once: true
            }
        });

        ScrollTrigger.batch(".community-tile", {
            start: "top 88%",
            once: true,
            interval: 0.08,
            onEnter: (elements) => {
                gsap.fromTo(elements, { autoAlpha: 0, y: 20 }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.08,
                    overwrite: true
                });
            }
        });

        gsap.fromTo(".community-actions, .community-tagline", { y: 16, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.08,
            scrollTrigger: {
                trigger: ".community-actions",
                start: "top 92%",
                once: true
            }
        });

        gsap.fromTo(".journal-section-head", { y: 24, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            scrollTrigger: {
                trigger: "#journal",
                start: "top 80%",
                once: true
            }
        });

        gsap.fromTo(".journal-featured", { y: 20, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            scrollTrigger: {
                trigger: ".journal-featured",
                start: "top 86%",
                once: true
            }
        });

        ScrollTrigger.batch(".journal-item", {
            start: "top 90%",
            once: true,
            interval: 0.08,
            onEnter: (elements) => {
                gsap.fromTo(elements, { autoAlpha: 0, y: 20 }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.65,
                    stagger: 0.08,
                    overwrite: true
                });
            }
        });

        gsap.fromTo(".journal-follow-cta", { y: 16, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            scrollTrigger: {
                trigger: ".journal-follow-cta",
                start: "top 94%",
                once: true
            }
        });

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(refresh);
        }

        return () => {
            window.removeEventListener("load", refresh);
        };
    });
})();
