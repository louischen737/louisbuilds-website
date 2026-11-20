/**
 * Sticky footer: Black Friday limited-time overlay + evergreen fallback.
 * Also upgrades Lifetime pricing card (strikethrough + discount badge) while sale is active.
 * Window aligns with TransMov app / ASC sale (UTC midnight):
 *   teaser 2026-11-12 → sale 2026-11-27 → end 2026-12-02
 */
(function () {
  var TEASER = Date.UTC(2026, 10, 12, 0, 0, 0);
  var SALE = Date.UTC(2026, 10, 27, 0, 0, 0);
  var END = Date.UTC(2026, 11, 2, 0, 0, 0);
  var REGULAR_PRICE = "$29.99";
  var SALE_PRICE = "$14.99";

  var COPY = {
    en: {
      comingLabel: "Black Friday · Lifetime Pro ~50% off starts soon",
      activeLabel: "Black Friday · Lifetime Pro ~50% off — limited time",
      comingCta: "Get the App →",
      activeCta: "Claim Offer →",
      comingPrefix: "Starts in",
      activePrefix: "Ends in",
      unitDay: "Day",
      unitHour: "Hrs",
      unitMin: "Min",
      discountBadge: "50% OFF",
      ctComing: "transmov_home_bf_coming",
      ctActive: "transmov_home_bf_active"
    },
    zh: {
      comingLabel: "黑色星期五 · 终身 Pro 约 5 折即将开售",
      activeLabel: "黑色星期五 · 终身 Pro 约 5 折限时优惠",
      comingCta: "前往下载 →",
      activeCta: "立即查看 →",
      comingPrefix: "开售倒计时",
      activePrefix: "距结束",
      unitDay: "天",
      unitHour: "时",
      unitMin: "分",
      discountBadge: "50% 优惠",
      ctComing: "transmov_home_zh_bf_coming",
      ctActive: "transmov_home_zh_bf_active"
    },
    de: {
      comingLabel: "Black Friday · Lifetime Pro bald ca. 50 % Rabatt",
      activeLabel: "Black Friday · Lifetime Pro jetzt ca. 50 % — begrenzt",
      comingCta: "App laden →",
      activeCta: "Angebot sichern →",
      comingPrefix: "Startet in",
      activePrefix: "Endet in",
      unitDay: "Tag",
      unitHour: "Std",
      unitMin: "Min",
      discountBadge: "50 % Rabatt",
      ctComing: "transmov_home_de_bf_coming",
      ctActive: "transmov_home_de_bf_active"
    },
    fr: {
      comingLabel: "Black Friday · Pro à vie bientôt −50 %",
      activeLabel: "Black Friday · Pro à vie −50 % — offre limitée",
      comingCta: "Télécharger →",
      activeCta: "Voir l'offre →",
      comingPrefix: "Début dans",
      activePrefix: "Fin dans",
      unitDay: "J",
      unitHour: "H",
      unitMin: "Min",
      discountBadge: "−50 %",
      ctComing: "transmov_home_fr_bf_coming",
      ctActive: "transmov_home_fr_bf_active"
    },
    es: {
      comingLabel: "Black Friday · Pro de por vida pronto −50 %",
      activeLabel: "Black Friday · Pro de por vida −50 % por tiempo limitado",
      comingCta: "Descargar →",
      activeCta: "Ver oferta →",
      comingPrefix: "Empieza en",
      activePrefix: "Termina en",
      unitDay: "Día",
      unitHour: "Hrs",
      unitMin: "Min",
      discountBadge: "50% dto.",
      ctComing: "transmov_home_es_bf_coming",
      ctActive: "transmov_home_es_bf_active"
    },
    ja: {
      comingLabel: "ブラックフライデー · 買い切りPro約50%OFFまもなく",
      activeLabel: "ブラックフライデー · 買い切りPro約50%OFF・期間限定",
      comingCta: "アプリへ →",
      activeCta: "特典を見る →",
      comingPrefix: "開始まで",
      activePrefix: "終了まで",
      unitDay: "日",
      unitHour: "時間",
      unitMin: "分",
      discountBadge: "50% OFF",
      ctComing: "transmov_home_ja_bf_coming",
      ctActive: "transmov_home_ja_bf_active"
    },
    ko: {
      comingLabel: "블랙 프라이데이 · 평생 Pro 약 50% 할인 곧 시작",
      activeLabel: "블랙 프라이데이 · 평생 Pro 약 50% 한정 특가",
      comingCta: "앱 받기 →",
      activeCta: "특가 보기 →",
      comingPrefix: "시작까지",
      activePrefix: "종료까지",
      unitDay: "일",
      unitHour: "시간",
      unitMin: "분",
      discountBadge: "50% 할인",
      ctComing: "transmov_home_ko_bf_coming",
      ctActive: "transmov_home_ko_bf_active"
    }
  };

  function detectLocale(bar) {
    var fromData = bar && (bar.getAttribute("data-locale") || "").trim().toLowerCase();
    if (fromData) return fromData.indexOf("zh") === 0 ? "zh" : fromData.slice(0, 2);
    var lang = (document.documentElement.lang || "en").toLowerCase();
    if (lang.indexOf("zh") === 0) return "zh";
    return lang.slice(0, 2);
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

  function withCt(url, ct) {
    try {
      var u = new URL(url, window.location.href);
      u.searchParams.set("ct", ct);
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  function extractUnitHtml(html) {
    var m = String(html || "").match(/<span[\s\S]*<\/span>\s*$/i);
    return m ? m[0] : "";
  }

  function ensurePricingCaches(card) {
    var badge = card.querySelector("[data-bf-badge]") || card.querySelector(".pricing-badge");
    var price = card.querySelector("[data-bf-price]") || card.querySelector(".pricing-price");
    if (badge && !badge.getAttribute("data-default-text")) {
      badge.setAttribute("data-default-text", badge.textContent.trim());
    }
    if (price && !price.getAttribute("data-default-html")) {
      price.setAttribute("data-default-html", price.innerHTML);
    }
    return { badge: badge, price: price };
  }

  function applyPricingSale(copy, phase) {
    var cards = document.querySelectorAll("[data-bf-lifetime]");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var parts = ensurePricingCaches(card);
      var badge = parts.badge;
      var price = parts.price;

      if (phase.id === "active") {
        card.classList.add("is-bf-sale");
        if (badge) {
          badge.textContent = copy.discountBadge || "50% OFF";
          badge.classList.add("pricing-badge--bf");
        }
        if (price) {
          var regular = price.getAttribute("data-regular") || REGULAR_PRICE;
          var sale = price.getAttribute("data-sale") || SALE_PRICE;
          var unitHtml = extractUnitHtml(price.getAttribute("data-default-html") || "");
          price.innerHTML =
            '<span class="pricing-price-was">' + regular + "</span>" +
            '<span class="pricing-price-current">' +
              '<span class="pricing-price-now">' + sale + "</span>" +
              (unitHtml ? " " + unitHtml : "") +
            "</span>";
        }
      } else {
        card.classList.remove("is-bf-sale");
        if (badge) {
          badge.textContent = badge.getAttribute("data-default-text") || badge.textContent;
          badge.classList.remove("pricing-badge--bf");
        }
        if (price && price.getAttribute("data-default-html")) {
          price.innerHTML = price.getAttribute("data-default-html");
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
    labelEl.textContent = isComing ? copy.comingLabel : copy.activeLabel;
    ctaEl.textContent = isComing ? copy.comingCta : copy.activeCta;

    var ct = isComing ? copy.ctComing : copy.ctActive;
    if (window.location.pathname.indexOf("/online") !== -1) {
      ct = ct.replace("_home_", "_online_");
    }
    var href = ctaEl.getAttribute("href");
    if (href) ctaEl.setAttribute("href", withCt(href, ct));

    bar.classList.add("is-bf");
    bar.setAttribute("data-bf-phase", phase.id);

    if (countdownEl) {
      countdownEl.hidden = false;
      countdownEl.innerHTML = renderCountdown(copy, phase, nowMs);
      var parts = remainingParts(phase.deadline, nowMs);
      countdownEl.setAttribute(
        "aria-label",
        (isComing ? copy.comingPrefix : copy.activePrefix) +
          " " +
          parts.days +
          copy.unitDay +
          " " +
          parts.hours +
          copy.unitHour +
          " " +
          parts.mins +
          copy.unitMin
      );
    }
  }

  function clearBf(bar) {
    if (!bar) return;
    bar.classList.remove("is-bf");
    bar.removeAttribute("data-bf-phase");
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
      if (isClosed) {
        bar.classList.add("is-hidden");
        return;
      }
      var y = window.scrollY || window.pageYOffset || 0;
      bar.classList.toggle("is-hidden", y < revealThreshold);
    }

    function refreshPhase() {
      var nowMs = Date.now();
      var phase = resolvePhase(nowMs);

      applyPricingSale(copy, phase);

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
      if (!ticker) {
        ticker = setInterval(refreshPhase, 30000);
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        isClosed = true;
        bar.classList.add("is-hidden");
        if (ticker) {
          clearInterval(ticker);
          ticker = null;
        }
      });
    }

    if (bar) {
      window.addEventListener("scroll", updateVisibility, { passive: true });
      window.addEventListener("resize", updateVisibility, { passive: true });
      updateVisibility();
    }

    refreshPhase();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStickyFooter);
  } else {
    initStickyFooter();
  }
})();
