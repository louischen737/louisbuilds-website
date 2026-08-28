(function () {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== "undefined") {
        gsap.registerPlugin(ScrollToPlugin);
    }

    const chapters = gsap.utils.toArray(".app-chapter");
    const progressNav = document.querySelector(".apps-progress");
    const productsSection = document.querySelector("#products");
    const progressButtons = progressNav
        ? gsap.utils.toArray(".apps-progress-btn", progressNav)
        : [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const HEADER_OFFSET = 88;

    if (!chapters.length) {
        return;
    }

    let progressVisibilityTrigger = null;

    function revealChapter(chapter) {
        const visual = chapter.querySelector(".app-chapter-visual");
        const copy = chapter.querySelector(".app-chapter-copy");
        gsap.set([visual, copy], { autoAlpha: 1, x: 0, y: 0, rotateY: 0, scale: 1, clearProps: "transform" });
    }

    function bindProgressNav() {
        if (progressNav && productsSection && desktopQuery.matches) {
            progressVisibilityTrigger = ScrollTrigger.create({
                trigger: productsSection,
                start: `top top+=${HEADER_OFFSET}`,
                end: "bottom top",
                onToggle: (self) => setProgressVisible(self.isActive)
            });
            setProgressVisible(progressVisibilityTrigger.isActive);
        } else if (progressNav) {
            progressVisibilityTrigger = null;
            setProgressVisible(false);
        }

        if (!progressButtons.length) return;

        progressButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const index = parseInt(button.dataset.chapterIndex, 10);
                const chapter = chapters[index];
                if (!chapter) return;

                if (typeof ScrollToPlugin !== "undefined") {
                    gsap.to(window, {
                        scrollTo: { y: chapter, offsetY: HEADER_OFFSET, autoKill: true },
                        duration: reduceMotion ? 0 : 0.85,
                        ease: "power3.inOut"
                    });
                } else {
                    const top = chapter.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
                    window.scrollTo(0, Math.max(0, top));
                }
            });
        });

        chapters.forEach((chapter, index) => {
            ScrollTrigger.create({
                trigger: chapter,
                start: "top center",
                end: "bottom center",
                onEnter: () => setProgressIndex(index),
                onEnterBack: () => setProgressIndex(index)
            });
        });
    }

    function setProgressVisible(visible) {
        if (!progressNav) return;
        const show = visible && desktopQuery.matches;
        progressNav.classList.toggle("is-visible", show);
        progressNav.setAttribute("aria-hidden", show ? "false" : "true");
    }

    function setProgressIndex(index) {
        progressButtons.forEach((button, i) => {
            const active = i === index;
            button.classList.toggle("is-active", active);
            if (active) {
                button.setAttribute("aria-current", "true");
            } else {
                button.removeAttribute("aria-current");
            }
        });
    }

    function initChapterMotion(chapter) {
        const visual = chapter.querySelector(".app-chapter-visual");
        const copy = chapter.querySelector(".app-chapter-copy");
        if (!visual || !copy) return;

        if (reduceMotion) {
            revealChapter(chapter);
            return;
        }

        gsap.fromTo(copy, { autoAlpha: 0, y: 24 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: {
                trigger: chapter,
                start: "top 80%",
                once: true
            }
        });

        if (desktopQuery.matches) {
            gsap.fromTo(visual, { autoAlpha: 0, y: 28 }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.85,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: chapter,
                    start: "top 82%",
                    once: true
                }
            });

            gsap.to(visual, {
                y: -12,
                ease: "none",
                scrollTrigger: {
                    trigger: chapter,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.55
                }
            });

            gsap.to(copy, {
                y: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: chapter,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.55
                }
            });
        } else {
            gsap.fromTo(visual, { autoAlpha: 0, scale: 0.98 }, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.75,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: chapter,
                    start: "top 86%",
                    once: true
                }
            });
        }
    }

    chapters.forEach((chapter) => initChapterMotion(chapter));
    bindProgressNav();

    function syncProgressVisibility() {
        if (progressVisibilityTrigger) {
            setProgressVisible(progressVisibilityTrigger.isActive);
        }
    }

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
        syncProgressVisibility();
    });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            ScrollTrigger.refresh();
            syncProgressVisibility();
        });
    }

    desktopQuery.addEventListener("change", () => {
        ScrollTrigger.refresh();
        syncProgressVisibility();
    });
})();
