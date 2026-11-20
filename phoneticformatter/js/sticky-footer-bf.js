/**
 * Homepage sticky bar for the Phonetic Formatter Black Friday window.
 * Dates are local midnight, matching the in-app paywall:
 *   teaser 2026-11-12 → sale 2026-11-27 → end 2026-12-02
 * Lifetime only: $19.99 → $9.99. Outside the window the bar stays hidden.
 * Preview with ?bf=coming | active | ended
 */
(function () {
  function localMidnight(year, month, day) {
    return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
  }

  var TEASER = localMidnight(2026, 11, 12);
  var SALE = localMidnight(2026, 11, 27);
  var END = localMidnight(2026, 12, 2);
  var REGULAR_PRICE = "$19.99";
  var SALE_PRICE = "$9.99";
  var STORE_BASE = "https://apps.apple.com/us/app/phonetic-formatter/id6757941187?pt=128214084&mt=8";

  var COPY = {
    en: {
      comingLabel: "Black Friday · Lifetime 50% off soon",
      activeLabel: "Black Friday · Lifetime 50% off, limited",
      comingCta: "Get the App →",
      activeCta: "Claim Offer →",
      comingPrefix: "Starts in",
      activePrefix: "Ends in",
      unitDay: "Day",
      unitHour: "Hrs",
      unitMin: "Min",
      discountBadge: "50% OFF",
      ctComing: "web_phoneticformatter_bf_coming",
      ctActive: "web_phoneticformatter_bf_active"
    },
    zh: {
      comingLabel: "黑色星期五 · 终身 Pro 即将五折",
      activeLabel: "黑色星期五 · 终身 Pro 限时五折",
      comingCta: "前往下载 →",
      activeCta: "立即查看 →",
      comingPrefix: "开售倒计时",
      activePrefix: "距结束",
      unitDay: "天",
      unitHour: "时",
      unitMin: "分",
      discountBadge: "50% 优惠",
      ctComing: "web_phoneticformatter_zh_bf_coming",
      ctActive: "web_phoneticformatter_zh_bf_active"
    },
    de: {
      comingLabel: "Black Friday · Lifetime bald 50 % Rabatt",
      activeLabel: "Black Friday · Lifetime 50 % Rabatt",
      comingCta: "App laden →",
      activeCta: "Angebot sichern →",
      comingPrefix: "Startet in",
      activePrefix: "Endet in",
      unitDay: "Tag",
      unitHour: "Std",
      unitMin: "Min",
      discountBadge: "50 % Rabatt",
      ctComing: "web_phoneticformatter_de_bf_coming",
      ctActive: "web_phoneticformatter_de_bf_active"
    },
    fr: {
      comingLabel: "Black Friday · Pro à vie −50 % bientôt",
      activeLabel: "Black Friday · Pro à vie −50 %",
      comingCta: "Télécharger →",
      activeCta: "Voir l'offre →",
      comingPrefix: "Début dans",
      activePrefix: "Fin dans",
      unitDay: "J",
      unitHour: "H",
      unitMin: "Min",
      discountBadge: "−50 %",
      ctComing: "web_phoneticformatter_fr_bf_coming",
      ctActive: "web_phoneticformatter_fr_bf_active"
    },
    es: {
      comingLabel: "Black Friday · Pro de por vida −50 % pronto",
      activeLabel: "Black Friday · Pro de por vida −50 %",
      comingCta: "Descargar →",
      activeCta: "Ver oferta →",
      comingPrefix: "Empieza en",
      activePrefix: "Termina en",
      unitDay: "Día",
      unitHour: "Hrs",
      unitMin: "Min",
      discountBadge: "50% dto.",
      ctComing: "web_phoneticformatter_es_bf_coming",
      ctActive: "web_phoneticformatter_es_bf_active"
    },
    ja: {
      comingLabel: "ブラックフライデー · 買い切り50%OFFまもなく",
      activeLabel: "ブラックフライデー · 買い切り50%OFF",
      comingCta: "アプリへ →",
      activeCta: "特典を見る →",
      comingPrefix: "開始まで",
      activePrefix: "終了まで",
      unitDay: "日",
      unitHour: "時間",
      unitMin: "分",
      discountBadge: "50% OFF",
      ctComing: "web_phoneticformatter_ja_bf_coming",
      ctActive: "web_phoneticformatter_ja_bf_active"
    },
    vi: {
      comingLabel: "Black Friday · Pro trọn đời sắp giảm 50%",
      activeLabel: "Black Friday · Pro trọn đời giảm 50%",
      comingCta: "Tải ứng dụng →",
      activeCta: "Xem ưu đãi →",
      comingPrefix: "Mở bán sau",
      activePrefix: "Kết thúc sau",
      unitDay: "Ngày",
      unitHour: "Giờ",
      unitMin: "Phút",
      discountBadge: "Giảm 50%",
      ctComing: "web_phoneticformatter_vi_bf_coming",
      ctActive: "web_phoneticformatter_vi_bf_active"
    },
    id: {
      comingLabel: "Black Friday · diskon 50% segera dimulai",
      activeLabel: "Black Friday · diskon 50% waktu terbatas",
      comingCta: "Unduh aplikasi →",
      activeCta: "Lihat promo →",
      comingPrefix: "Mulai dalam",
      activePrefix: "Berakhir dalam",
      unitDay: "Hari",
      unitHour: "Jam",
      unitMin: "Mnt",
      discountBadge: "Diskon 50%",
      ctComing: "web_phoneticformatter_id_bf_coming",
      ctActive: "web_phoneticformatter_id_bf_active"
    },
    it: {
      comingLabel: "Black Friday · Pro a vita −50% in arrivo",
      activeLabel: "Black Friday · Pro a vita −50%",
      comingCta: "Scarica l'app →",
      activeCta: "Vedi offerta →",
      comingPrefix: "Inizia tra",
      activePrefix: "Finisce tra",
      unitDay: "G",
      unitHour: "H",
      unitMin: "Min",
      discountBadge: "−50%",
      ctComing: "web_phoneticformatter_it_bf_coming",
      ctActive: "web_phoneticformatter_it_bf_active"
    },
    ar: {
      comingLabel: "الجمعة السوداء · خصم 50% قريباً",
      activeLabel: "الجمعة السوداء · خصم 50% لفترة محدودة",
      comingCta: "احصل على التطبيق ←",
      activeCta: "احصل على العرض ←",
      comingPrefix: "يبدأ بعد",
      activePrefix: "ينتهي بعد",
      unitDay: "يوم",
      unitHour: "س",
      unitMin: "د",
      discountBadge: "خصم 50%",
      ctComing: "web_phoneticformatter_ar_bf_coming",
      ctActive: "web_phoneticformatter_ar_bf_active"
    },
    ro: {
      comingLabel: "Black Friday · Pro pe viață −50% în curând",
      activeLabel: "Black Friday · Pro pe viață −50%",
      comingCta: "Descarcă aplicația →",
      activeCta: "Vezi oferta →",
      comingPrefix: "Începe în",
      activePrefix: "Se termină în",
      unitDay: "Zi",
      unitHour: "Ore",
      unitMin: "Min",
      discountBadge: "−50%",
      ctComing: "web_phoneticformatter_ro_bf_coming",
      ctActive: "web_phoneticformatter_ro_bf_active"
    }
  };

  function detectLocale(bar) {
    var fromData = bar && (bar.getAttribute("data-locale") || "").trim().toLowerCase();
    if (fromData && COPY[fromData]) return fromData;
    var lang = (document.documentElement.lang || "en").toLowerCase();
    if (lang.indexOf("zh") === 0) return "zh";
    var short = lang.slice(0, 2);
    return COPY[short] ? short : "en";
  }

  function phaseAt(nowMs) {
    if (nowMs < TEASER || nowMs >= END) return { id: "ended" };
    if (nowMs < SALE) return { id: "coming", deadline: SALE };
    return { id: "active", deadline: END };
  }

  function resolvePhase(nowMs) {
    var q = new URLSearchParams(window.location.search).get("bf");
    if (q === "coming") return { id: "coming", deadline: SALE };
    if (q === "active") return { id: "active", deadline: END };
    if (q === "ended") return { id: "ended" };
    return phaseAt(nowMs);
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function remainingParts(deadlineMs, nowMs) {
    var ms = Math.max(0, deadlineMs - nowMs);
    var totalMin = Math.floor(ms / 60000);
    return {
      days: Math.floor(totalMin / (60 * 24)),
      hours: Math.floor((totalMin % (60 * 24)) / 60),
      mins: totalMin % 60
    };
  }

  function unitCell(value, label) {
    return (
      '<span class="bf-unit">' +
        '<span class="bf-unit-value">' + pad(value) + "</span>" +
        '<span class="bf-unit-label">' + label + "</span>" +
      "</span>"
    );
  }

  function renderCountdown(copy, phase, nowMs) {
    var parts = remainingParts(phase.deadline, nowMs);
    var prefix = phase.id === "coming" ? copy.comingPrefix : copy.activePrefix;
    return (
      '<span class="bf-countdown-prefix">' + prefix + "</span>" +
      '<span class="bf-countdown-calendar" aria-hidden="true">' +
        unitCell(parts.days, copy.unitDay) +
        unitCell(parts.hours, copy.unitHour) +
        unitCell(parts.mins, copy.unitMin) +
      "</span>"
    );
  }

  function storeUrl(ct) {
    try {
      var u = new URL(STORE_BASE);
      u.searchParams.set("ct", ct);
      return u.toString();
    } catch (e) {
      return STORE_BASE;
    }
  }

  function applyPricing(copy, phase) {
    var boxes = document.querySelectorAll("[data-bf-lifetime]");
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      var value = box.querySelector("[data-bf-price]");
      var note = box.querySelector(".pricing-footer-price-note");
      if (!value) continue;
      if (!value.getAttribute("data-default-text")) {
        value.setAttribute("data-default-text", (value.textContent || "").trim());
      }
      if (note && !note.getAttribute("data-default-text")) {
        note.setAttribute("data-default-text", (note.textContent || "").trim());
      }
      if (phase.id === "active") {
        box.classList.add("is-bf-sale");
        var regular = value.getAttribute("data-regular") || REGULAR_PRICE;
        var sale = value.getAttribute("data-sale") || SALE_PRICE;
        value.innerHTML =
          '<span class="bf-price-was">' + regular + "</span>" +
          '<span class="bf-price-now">' + sale + "</span>";
        if (note) note.textContent = copy.discountBadge;
      } else {
        box.classList.remove("is-bf-sale");
        value.textContent = value.getAttribute("data-default-text") || REGULAR_PRICE;
        if (note && note.getAttribute("data-default-text")) {
          note.textContent = note.getAttribute("data-default-text");
        }
      }
    }
  }

  function applyBf(bar, copy, phase, nowMs) {
    var labelEl = bar.querySelector("[data-sticky-label]");
    var ctaEl = bar.querySelector("[data-sticky-cta]");
    var countdownEl = bar.querySelector("[data-sticky-countdown]");
    if (!labelEl || !ctaEl) return;

    var isComing = phase.id === "coming";
    var label = isComing ? copy.comingLabel : copy.activeLabel;
    labelEl.textContent = label;
    ctaEl.textContent = isComing ? copy.comingCta : copy.activeCta;
    ctaEl.setAttribute("href", storeUrl(isComing ? copy.ctComing : copy.ctActive));

    bar.classList.add("is-bf");
    bar.setAttribute("data-bf-phase", phase.id);
    bar.setAttribute("aria-label", label);

    if (countdownEl) {
      countdownEl.hidden = false;
      countdownEl.innerHTML = renderCountdown(copy, phase, nowMs);
      var parts = remainingParts(phase.deadline, nowMs);
      countdownEl.setAttribute(
        "aria-label",
        (isComing ? copy.comingPrefix : copy.activePrefix) +
          " " +
          parts.days +
          " " +
          copy.unitDay +
          " " +
          parts.hours +
          " " +
          copy.unitHour +
          " " +
          parts.mins +
          " " +
          copy.unitMin
      );
    }
  }

  function clearBf(bar) {
    if (!bar) return;
    bar.classList.remove("is-bf");
    bar.classList.add("is-hidden");
    bar.setAttribute("aria-hidden", "true");
    bar.removeAttribute("data-bf-phase");
    bar.removeAttribute("aria-label");
    var countdownEl = bar.querySelector("[data-sticky-countdown]");
    if (countdownEl) {
      countdownEl.hidden = true;
      countdownEl.innerHTML = "";
      countdownEl.removeAttribute("aria-label");
    }
  }

  function initStickyFooter() {
    var bar = document.querySelector("[data-sticky-footer]");
    var closeBtn = bar && bar.querySelector("[data-sticky-footer-close]");
    var isClosed = false;
    var revealThreshold = 120;
    var locale = detectLocale(bar);
    var copy = COPY[locale] || COPY.en;
    var ticker = null;

    function updateVisibility() {
      if (!bar) return;
      if (isClosed || !bar.getAttribute("data-bf-phase")) {
        bar.classList.add("is-hidden");
        bar.setAttribute("aria-hidden", "true");
        return;
      }
      var y = window.scrollY || window.pageYOffset || 0;
      var hidden = y < revealThreshold;
      bar.classList.toggle("is-hidden", hidden);
      bar.setAttribute("aria-hidden", hidden ? "true" : "false");
    }

    function refreshPhase() {
      var nowMs = Date.now();
      var phase = resolvePhase(nowMs);
      applyPricing(copy, phase);

      if (!bar) return;
      if (phase.id === "ended") {
        clearBf(bar);
        if (ticker) {
          clearInterval(ticker);
          ticker = null;
        }
        return;
      }

      applyBf(bar, copy, phase, nowMs);
      updateVisibility();
      if (!ticker) ticker = setInterval(refreshPhase, 30000);
    }

    if (closeBtn && bar) {
      closeBtn.addEventListener("click", function () {
        isClosed = true;
        bar.classList.add("is-hidden");
        if (ticker) {
          clearInterval(ticker);
          ticker = null;
        }
      });
    }

    var ctaEl = bar && bar.querySelector("[data-sticky-cta]");
    if (ctaEl) {
      ctaEl.addEventListener("click", function () {
        if (typeof window.gtag !== "function") return;
        window.gtag("event", "download_click", {
          app: "phonetic_formatter",
          position: "sticky_footer_bf",
          bf_phase: bar.getAttribute("data-bf-phase") || ""
        });
      });
    }

    if (bar) {
      window.addEventListener("scroll", updateVisibility, { passive: true });
      window.addEventListener("resize", updateVisibility, { passive: true });
    }

    refreshPhase();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStickyFooter);
  } else {
    initStickyFooter();
  }
})();
