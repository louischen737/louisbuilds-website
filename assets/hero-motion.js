(function () {
    if (typeof Motion === "undefined") return;

    const { animate, stagger } = Motion;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hero = document.querySelector(".hero");
    const titleEl = document.querySelector(".hero-title");
    const staggerLines = Array.from(document.querySelectorAll("[data-hero-stagger]"));
    const ledeEl = document.querySelector(".hero-lede");
    const btn = document.querySelector(".hero .explore-btn");
    const video = document.querySelector(".hero-video");

    if (!hero || !titleEl || !staggerLines.length || !ledeEl || !btn) return;

    const CHAR_STAGGER = 0.07;

    function splitChars(el) {
        const text = el.textContent;
        el.textContent = "";
        const chars = [];
        for (const ch of text) {
            const span = document.createElement("span");
            span.className = "hero-char";
            span.textContent = ch === " " ? "\u00a0" : ch;
            span.setAttribute("aria-hidden", "true");
            span.style.opacity = "0";
            el.appendChild(span);
            chars.push(span);
        }
        return chars;
    }

    function revealStatic() {
        titleEl.classList.add("is-split");
        titleEl.style.opacity = "1";
        ledeEl.style.opacity = "1";
        btn.style.opacity = "1";
        staggerLines.forEach((line) => {
            line.classList.remove("is-waiting");
            if (!line.querySelector(".hero-char")) splitChars(line);
            line.querySelectorAll(".hero-char").forEach((char) => {
                char.style.opacity = "1";
            });
        });
    }

    function staggeredFade(chars) {
        return animate(chars, { opacity: [0, 1] }, {
            duration: 0.55,
            ease: "easeOut",
            delay: stagger(CHAR_STAGGER, { startDelay: 0.05 })
        }).finished;
    }

    const headlineText = staggerLines.map((line) => line.textContent.trim()).join(". ");
    titleEl.setAttribute("aria-label", headlineText);

    const lineChars = staggerLines.map((line) => splitChars(line));

    staggerLines.slice(1).forEach((line) => {
        line.classList.add("is-waiting");
    });

    titleEl.classList.add("is-split");

    async function playHero() {
        if (reduceMotion) {
            if (video) video.pause();
            revealStatic();
            return;
        }

        await staggeredFade(lineChars[0]);

        if (staggerLines[1]) {
            staggerLines[1].classList.remove("is-waiting");
        }
        if (lineChars[1]) {
            await staggeredFade(lineChars[1]);
        }

        animate(ledeEl, { opacity: [0, 1], y: [20, 0] }, {
            duration: 0.8,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
        });

        animate(btn, { opacity: [0, 1], y: [20, 0] }, {
            duration: 0.8,
            delay: 0.45,
            ease: [0.16, 1, 0.3, 1]
        });
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(playHero);
    } else {
        playHero();
    }
})();
