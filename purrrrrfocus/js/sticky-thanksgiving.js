/**
 * Thanksgiving lifetime offer on the existing homepage download bar.
 * Local midnight, matching the in-app campaign:
 *   teaser 2026-11-20 → sale 2026-11-26 → end 2026-12-02
 * Outside that window the bar stays the evergreen download line.
 * Preview with ?tg=coming | active | ended
 */
(function () {
  function localMidnight(year, month, day) {
    return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
  }

  var TEASER = localMidnight(2026, 11, 20);
  var SALE = localMidnight(2026, 11, 26);
  var END = localMidnight(2026, 12, 2);

  var COPY = {
    en: {
      comingLabel: 'Thanksgiving · Plus Lifetime <span class="tg-off">50% off</span> soon',
      activeLabel: 'Thanksgiving · Plus Lifetime <span class="tg-off">50% off</span>',
      comingPrefix: "Starts in",
      activePrefix: "Ends in",
      unitDay: "Day",
      unitHour: "Hrs",
      unitMin: "Min",
      ctComing: "web_purrrrrfocus_tg_coming",
      ctActive: "web_purrrrrfocus_tg_active"
    },
    zh: {
      comingLabel: '感恩节 · 终身 Plus 即将<span class="tg-off">半价</span>',
      activeLabel: '感恩节 · 终身 Plus 限时<span class="tg-off">半价</span>',
      comingPrefix: "开售倒计时",
      activePrefix: "距结束",
      unitDay: "天",
      unitHour: "时",
      unitMin: "分",
      ctComing: "web_purrrrrfocus_zh_tg_coming",
      ctActive: "web_purrrrrfocus_zh_tg_active"
    },
    de: {
      comingLabel: 'Thanksgiving · Plus Lifetime bald <span class="tg-off">50 %</span>',
      activeLabel: 'Thanksgiving · Plus Lifetime <span class="tg-off">50 % Rabatt</span>',
      comingPrefix: "Startet in",
      activePrefix: "Endet in",
      unitDay: "Tag",
      unitHour: "Std.",
      unitMin: "Min.",
      ctComing: "web_purrrrrfocus_de_tg_coming",
      ctActive: "web_purrrrrfocus_de_tg_active"
    },
    fr: {
      comingLabel: 'Thanksgiving · Plus à vie <span class="tg-off">−50 %</span> bientôt',
      activeLabel: 'Thanksgiving · Plus à vie <span class="tg-off">−50 %</span>',
      comingPrefix: "Début dans",
      activePrefix: "Fin dans",
      unitDay: "j",
      unitHour: "h",
      unitMin: "min",
      ctComing: "web_purrrrrfocus_fr_tg_coming",
      ctActive: "web_purrrrrfocus_fr_tg_active"
    },
    es: {
      comingLabel: 'Thanksgiving · Plus vitalicio <span class="tg-off">−50 %</span> pronto',
      activeLabel: 'Thanksgiving · Plus vitalicio <span class="tg-off">−50 %</span>',
      comingPrefix: "Empieza en",
      activePrefix: "Termina en",
      unitDay: "Día",
      unitHour: "h",
      unitMin: "min",
      ctComing: "web_purrrrrfocus_es_tg_coming",
      ctActive: "web_purrrrrfocus_es_tg_active"
    },
    tr: {
      comingLabel: 'Şükran Günü · Plus ömür boyu <span class="tg-off">%50</span> yakında',
      activeLabel: 'Şükran Günü · Plus ömür boyu <span class="tg-off">%50</span>',
      comingPrefix: "Başlamasına",
      activePrefix: "Bitmesine",
      unitDay: "Gün",
      unitHour: "Sa",
      unitMin: "Dk",
      ctComing: "web_purrrrrfocus_tr_tg_coming",
      ctActive: "web_purrrrrfocus_tr_tg_active"
    },
    da: {
      comingLabel: 'Thanksgiving · Plus livstid <span class="tg-off">50 %</span> snart',
      activeLabel: 'Thanksgiving · Plus livstid <span class="tg-off">50 % rabat</span>',
      comingPrefix: "Starter om",
      activePrefix: "Slutter om",
      unitDay: "Dag",
      unitHour: "T.",
      unitMin: "Min.",
      ctComing: "web_purrrrrfocus_da_tg_coming",
      ctActive: "web_purrrrrfocus_da_tg_active"
    }
  };

  function detectLocale(bar) {
    var raw = (bar.getAttribute("data-locale") || document.documentElement.lang || "en")
      .trim()
      .toLowerCase();
    if (raw.indexOf("zh") === 0) return "zh";
    if (COPY[raw]) return raw;
    return "en";
  }

  function phaseAt(nowMs) {
    if (nowMs < TEASER || nowMs >= END) return { id: "ended" };
    if (nowMs < SALE) return { id: "coming", deadline: SALE };
    return { id: "active", deadline: END };
  }

  function resolvePhase(nowMs) {
    var q = "";
    try {
      q = new URLSearchParams(window.location.search).get("tg") || "";
    } catch (e) {
      q = "";
    }
    if (q === "coming") return { id: "coming", deadline: SALE };
    if (q === "active") return { id: "active", deadline: END };
    if (q === "ended") return { id: "ended" };
    return phaseAt(nowMs);
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function remainingParts(deadlineMs, nowMs) {
    var totalMin = Math.floor(Math.max(0, deadlineMs - nowMs) / 60000);
    return {
      days: Math.floor(totalMin / (60 * 24)),
      hours: Math.floor((totalMin % (60 * 24)) / 60),
      mins: totalMin % 60
    };
  }

  function unitCell(value, label) {
    return (
      '<span class="tg-unit">' +
        '<span class="tg-unit-value">' + pad(value) + "</span>" +
        '<span class="tg-unit-label">' + label + "</span>" +
      "</span>"
    );
  }

  function renderCountdown(copy, phase, nowMs) {
    var parts = remainingParts(phase.deadline, nowMs);
    var prefix = phase.id === "coming" ? copy.comingPrefix : copy.activePrefix;
    return (
      '<span class="tg-countdown-prefix">' + prefix + "</span>" +
      '<span class="tg-countdown-calendar" aria-hidden="true">' +
        unitCell(parts.days, copy.unitDay) +
        unitCell(parts.hours, copy.unitHour) +
        unitCell(parts.mins, copy.unitMin) +
      "</span>"
    );
  }

  function storeUrl(base, ct) {
    try {
      var u = new URL(base, window.location.href);
      if (!u.searchParams.get("pt")) u.searchParams.set("pt", "128214084");
      u.searchParams.set("ct", ct);
      return u.toString();
    } catch (e) {
      return base;
    }
  }

  function plainText(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || "").replace(/\s+/g, " ").trim();
  }

  function init() {
    var bar = document.getElementById("sticky-download");
    if (!bar) return;
    var labelEl = bar.querySelector(".sticky-download-line");
    var countdownEl = bar.querySelector(".tg-countdown");
    var ctaEl = bar.querySelector(".sticky-download-badge");
    if (!labelEl || !countdownEl || !ctaEl) return;

    var locale = detectLocale(bar);
    var copy = COPY[locale] || COPY.en;
    var defaultLabel = labelEl.innerHTML;
    var defaultHref = ctaEl.getAttribute("href") || "";
    var tracked = false;

    function restore() {
      bar.classList.remove("is-tg");
      bar.removeAttribute("data-tg-phase");
      labelEl.innerHTML = defaultLabel;
      countdownEl.hidden = true;
      countdownEl.innerHTML = "";
      countdownEl.removeAttribute("aria-label");
      ctaEl.setAttribute("href", defaultHref);
    }

    function apply(phase, nowMs) {
      var isComing = phase.id === "coming";
      var label = isComing ? copy.comingLabel : copy.activeLabel;
      labelEl.innerHTML = label;
      countdownEl.hidden = false;
      countdownEl.innerHTML = renderCountdown(copy, phase, nowMs);
      var parts = remainingParts(phase.deadline, nowMs);
      var prefix = isComing ? copy.comingPrefix : copy.activePrefix;
      countdownEl.setAttribute(
        "aria-label",
        prefix + " " + parts.days + " " + copy.unitDay + " " + parts.hours + " " + copy.unitHour + " " + parts.mins + " " + copy.unitMin
      );
      ctaEl.setAttribute("href", storeUrl(defaultHref, isComing ? copy.ctComing : copy.ctActive));
      bar.classList.add("is-tg");
      bar.setAttribute("data-tg-phase", phase.id);
      bar.setAttribute("aria-label", plainText(label));
    }

    function syncHeight() {
      var root = document.documentElement;
      if (!bar.classList.contains("is-tg") || bar.hidden) {
        root.style.removeProperty("--sticky-download-height");
        return;
      }
      var cs = window.getComputedStyle(bar);
      var padTop = parseFloat(cs.paddingTop) || 0;
      var padBottom = parseFloat(cs.paddingBottom) || 0;
      var safe = Math.max(0, padBottom - padTop);
      var h = Math.ceil(bar.offsetHeight - safe);
      if (h > 0) root.style.setProperty("--sticky-download-height", h + "px");
    }

    function refresh() {
      var phase = resolvePhase(Date.now());
      if (phase.id === "ended") restore();
      else apply(phase, Date.now());
      syncHeight();
    }

    if (typeof ResizeObserver === "function") {
      var ro = new ResizeObserver(function () { syncHeight(); });
      ro.observe(bar);
    }
    window.addEventListener("resize", syncHeight);

    if (!tracked) {
      tracked = true;
      ctaEl.addEventListener("click", function () {
        if (!bar.classList.contains("is-tg") || typeof window.gtag !== "function") return;
        window.gtag("event", "download_click", {
          app: "purrrrrfocus",
          lang: locale,
          position: "sticky_tg",
          tg_phase: bar.getAttribute("data-tg-phase") || ""
        });
      });
    }

    refresh();
    setInterval(refresh, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
