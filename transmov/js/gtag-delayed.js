/**
 * GA4 + Google Ads: defer gtag.js fetch/parse to reduce main-thread contention (INP).
 * Requires inline stub: dataLayer + gtag() queue in HTML before this script.
 *
 * Ads conversion "TransMov下载点击" fires on App Store download CTA clicks
 * (id6756703030), without wrapping gtag (wrap was fragile with gtag.js).
 */
(function () {
  var MEASUREMENT_ID = 'G-2TMXET2TJN';
  var ADS_ID = 'AW-18381116529';
  var ADS_CONVERSION = 'AW-18381116529/nES9CILU3N8cEPGo5rxE';
  var DELAY_MS = 2500;
  var APP_STORE_MARKER = 'id6756703030';

  function sendAdsConversion(callback) {
    if (typeof window.gtag !== 'function') return;
    var params = { send_to: ADS_CONVERSION };
    if (typeof callback === 'function') {
      params.event_callback = callback;
      params.event_timeout = 2000;
    }
    window.gtag('event', 'conversion', params);
  }

  /**
   * Same-tab helper from Google's click snippet. App Store CTAs use target=_blank;
   * prefer the click listener below for those.
   */
  window.gtag_report_conversion = function (url) {
    var callback = function () {
      if (typeof url !== 'undefined') {
        window.location = url;
      }
    };
    if (typeof window.gtag === 'function') {
      sendAdsConversion(callback);
    } else if (typeof url !== 'undefined') {
      window.location = url;
    }
    return false;
  };

  function isTransmovAppStoreLink(href) {
    if (!href) return false;
    return (
      href.indexOf('apps.apple.com') !== -1 &&
      href.indexOf(APP_STORE_MARKER) !== -1
    );
  }

  // Capture clicks on download CTAs even if onclick only sends GA download_click.
  document.addEventListener(
    'click',
    function (e) {
      var el = e.target;
      if (!el) return;
      var anchor = el.closest ? el.closest('a') : null;
      if (!anchor && el.tagName === 'A') anchor = el;
      if (!anchor) return;
      if (!isTransmovAppStoreLink(anchor.href)) return;
      sendAdsConversion();
    },
    true
  );

  function boot() {
    if (window.__transmovGtagInjected) return;
    window.__transmovGtagInjected = true;
    var s = document.createElement('script');
    s.async = true;
    // Load with Ads ID so Google's tag diagnostics can detect AW on the page.
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ADS_ID);
    s.onload = function () {
      gtag('js', new Date());
      gtag('config', MEASUREMENT_ID);
      gtag('config', ADS_ID);
    };
    document.head.appendChild(s);
  }

  setTimeout(boot, DELAY_MS);
})();
