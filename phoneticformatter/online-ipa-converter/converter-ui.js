/**
 * Online IPA converter UI — by-sentence, 500 chars.
 * UI strings: set window.PF_CONVERTER_I18N before this script loads.
 */
(function () {
  "use strict";

  var MAX = (window.PhoneticEngine && PhoneticEngine.MAX_CHARS) || 500;
  var I18N = Object.assign(
    {
      counter: "{n} / {max} characters",
      limitedTo: "Limited to {max} characters.",
      loadingDict: "Loading pronunciation dictionary…",
      dictReady:
        "Dictionary ready. Runs locally in your browser — text is not uploaded.",
      dictError: "Could not load dictionary. Please refresh the page.",
      copyAria: "Copy IPA",
      copiedAria: "Copied",
    },
    window.PF_CONVERTER_I18N || {}
  );

  function t(key, vars) {
    var s = I18N[key] || "";
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }

  var input = document.getElementById("pf-input");
  var convertBtn = document.getElementById("pf-convert");
  var clearBtn = document.getElementById("pf-clear");
  var copyBtn = document.getElementById("pf-copy");
  var copyLabel = copyBtn ? copyBtn.querySelector(".pf-copy-label") : null;
  var copyCheck = copyBtn ? copyBtn.querySelector(".pf-copy-check") : null;
  var output = document.getElementById("pf-output");
  var counter = document.getElementById("pf-counter");
  var statusEl = document.getElementById("pf-status");
  var popover = document.getElementById("pf-pron-popover");
  var popoverList = popover ? popover.querySelector(".pf-pron-popover-list") : null;
  var activeMulti = null;
  var dictReady = false;
  var lastBlocks = null;
  var copyResetTimer = null;

  var SAMPLE =
    "Please focus on the distinction between 'sheep' and 'ship', or 'reach' and 'rich'. Accurate phonetic transcription helps students master these subtle vowel shifts.";

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("is-error", !!isError);
  }

  function updateCounter() {
    var len = (input.value || "").length;
    if (counter) {
      counter.textContent = t("counter", { n: len, max: MAX });
      counter.classList.toggle("is-near-limit", len >= MAX - 40);
      counter.classList.toggle("is-at-limit", len >= MAX);
    }
    if (convertBtn) {
      convertBtn.disabled = !dictReady || !len;
    }
  }

  function enforceLimit() {
    var v = input.value || "";
    if (v.length > MAX) {
      input.value = v.slice(0, MAX);
      setStatus(t("limitedTo", { max: MAX }), false);
    }
    updateCounter();
  }

  function hidePopover() {
    if (!popover) return;
    popover.hidden = true;
    if (activeMulti) {
      activeMulti.setAttribute("aria-expanded", "false");
    }
    activeMulti = null;
  }

  function showPopover(btn) {
    if (!popover || !popoverList) return;
    var raw = btn.getAttribute("data-pronunciations");
    var list;
    try {
      list = JSON.parse(raw);
    } catch (e) {
      return;
    }
    if (!list || !list.length) return;

    while (popoverList.firstChild) popoverList.removeChild(popoverList.firstChild);
    for (var i = 0; i < list.length; i++) {
      var li = document.createElement("li");
      li.textContent = "/" + list[i] + "/";
      if (i === 0) li.className = "is-default";
      popoverList.appendChild(li);
    }

    if (activeMulti && activeMulti !== btn) {
      activeMulti.setAttribute("aria-expanded", "false");
    }
    activeMulti = btn;
    btn.setAttribute("aria-expanded", "true");
    popover.hidden = false;

    var rect = btn.getBoundingClientRect();
    var pad = 8;
    var top = rect.bottom + window.scrollY + pad;
    var left = rect.left + window.scrollX;
    popover.style.top = top + "px";
    popover.style.left = left + "px";

    requestAnimationFrame(function () {
      var pr = popover.getBoundingClientRect();
      var maxRight = window.scrollX + document.documentElement.clientWidth - 12;
      if (pr.right > maxRight) {
        left = Math.max(12, left - (pr.right - maxRight));
        popover.style.left = left + "px";
      }
      var maxBottom = window.scrollY + document.documentElement.clientHeight - 12;
      if (pr.bottom > maxBottom) {
        top = rect.top + window.scrollY - pr.height - pad;
        popover.style.top = Math.max(12, top) + "px";
      }
    });
  }

  function togglePopover(btn) {
    if (activeMulti === btn && popover && !popover.hidden) {
      hidePopover();
    } else {
      showPopover(btn);
    }
  }

  function runConvert() {
    if (!dictReady || !window.PhoneticEngine) return;
    hidePopover();
    var text = (input.value || "").trim();
    if (!text) {
      lastBlocks = null;
      if (copyBtn) copyBtn.disabled = true;
      PhoneticRender.renderBlocks(output, []);
      return;
    }
    var tokens = PhoneticEngine.format(text);
    lastBlocks = PhoneticEngine.buildSentenceBlocks(tokens, "/", "/");
    PhoneticRender.renderBlocks(output, lastBlocks);
    if (copyBtn) copyBtn.disabled = !lastBlocks || !lastBlocks.length;
    setStatus("", false);
    if (typeof gtag === "function") {
      gtag("event", "ipa_convert", { app: "phonetic_formatter", chars: text.length });
    }
  }

  function resetCopyButton() {
    if (!copyBtn) return;
    copyBtn.classList.remove("is-copied");
    if (copyLabel) copyLabel.hidden = false;
    if (copyCheck) copyCheck.hidden = true;
    copyBtn.setAttribute("aria-label", t("copyAria"));
  }

  function showCopiedState() {
    if (!copyBtn) return;
    copyBtn.classList.add("is-copied");
    if (copyLabel) copyLabel.hidden = true;
    if (copyCheck) copyCheck.hidden = false;
    copyBtn.setAttribute("aria-label", t("copiedAria"));
    if (copyResetTimer) clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(function () {
      resetCopyButton();
      copyResetTimer = null;
    }, 1600);
  }

  function copyResult() {
    if (!lastBlocks || !window.PhoneticEngine || (copyBtn && copyBtn.disabled)) return;
    var plain = PhoneticEngine.blocksToPlainText(lastBlocks);
    if (!plain) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(plain).then(showCopiedState).catch(function () {});
    } else {
      var ta = document.createElement("textarea");
      ta.value = plain;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showCopiedState();
      } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  function initUi() {
    if (!input || !output) return;

    if (!input.value) input.value = SAMPLE;
    updateCounter();
    PhoneticRender.renderBlocks(output, []);

    input.addEventListener("input", function () {
      enforceLimit();
      setStatus("", false);
    });
    input.addEventListener("paste", function () {
      setTimeout(enforceLimit, 0);
    });

    if (convertBtn) convertBtn.addEventListener("click", runConvert);
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        hidePopover();
        input.value = "";
        lastBlocks = null;
        if (copyBtn) copyBtn.disabled = true;
        resetCopyButton();
        updateCounter();
        PhoneticRender.renderBlocks(output, []);
        setStatus("", false);
        input.focus();
      });
    }
    if (copyBtn) copyBtn.addEventListener("click", copyResult);

    output.addEventListener("click", function (e) {
      var btn = e.target.closest(".pf-multi");
      if (!btn || !output.contains(btn)) return;
      e.preventDefault();
      togglePopover(btn);
    });

    document.addEventListener("click", function (e) {
      if (!popover || popover.hidden) return;
      if (popover.contains(e.target)) return;
      if (e.target.closest && e.target.closest(".pf-multi")) return;
      hidePopover();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hidePopover();
    });

    window.addEventListener("scroll", hidePopover, { passive: true });
    window.addEventListener("resize", hidePopover);
  }

  function boot() {
    initUi();
    setStatus(t("loadingDict"), false);
    if (convertBtn) convertBtn.disabled = true;

    PhoneticDictionaryLoader.load("../data/ipa-dict.json")
      .then(function (map) {
        PhoneticEngine.setDictionary(map);
        dictReady = true;
        setStatus(t("dictReady"), false);
        updateCounter();
        if ((input.value || "").trim()) runConvert();
      })
      .catch(function (err) {
        setStatus(t("dictError"), true);
        console.error(err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
