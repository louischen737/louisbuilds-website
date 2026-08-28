(function () {
    if (typeof Motion === "undefined") return;

    const { animate, stagger } = Motion;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctaSection = document.querySelector(".site-cta");
    const titleEl = document.querySelector(".site-cta-title");
    const staggerLines = Array.from(document.querySelectorAll("[data-cta-stagger]"));

    if (!ctaSection || !titleEl || !staggerLines.length) return;

    const CHAR_STAGGER = 0.06;

    function splitChars(el) {
        const text = el.textContent;
        el.textContent = "";
        const chars = [];
        for (const ch of text) {
            const span = document.createElement("span");
            span.className = "cta-char";
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
        staggerLines.forEach((line) => {
            line.classList.remove("is-waiting");
            if (!line.querySelector(".cta-char")) splitChars(line);
            line.querySelectorAll(".cta-char").forEach((char) => {
                char.style.opacity = "1";
            });
        });
    }

    function staggeredFade(chars) {
        return animate(chars, { opacity: [0, 1] }, {
            duration: 0.5,
            ease: "easeOut",
            delay: stagger(CHAR_STAGGER, { startDelay: 0.04 })
        }).finished;
    }

    const headlineText = staggerLines.map((line) => line.textContent.trim()).join(" ");
    titleEl.setAttribute("aria-label", headlineText);

    const lineChars = staggerLines.map((line) => splitChars(line));

    staggerLines.slice(1).forEach((line) => {
        line.classList.add("is-waiting");
    });

    titleEl.classList.add("is-split");

    let played = false;

    async function playCta() {
        if (played) return;
        played = true;

        if (reduceMotion) {
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
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    playCta();
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.35 }
    );

    observer.observe(ctaSection);
})();
