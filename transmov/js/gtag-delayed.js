/**
 * GA4 + Google Ads: defer gtag.js fetch/parse to reduce main-thread contention (INP).
 * Requires inline stub: dataLayer + gtag() queue in HTML before this script.
 * Any gtag('event', 'download_click', ...) also sends Ads conversion
 * AW-18381116529/nES9CILU3N8cEPGo5rxE (TransMov下载点击).
 *
 * Download CTAs use target="_blank", so we fire conversion without return false /
 * window.location (Google's same-tab click snippet would break new-tab links).
 */
(function () {
  var MEASUREMENT_ID = 'G-2TMXET2TJN';
  var ADS_ID = 'AW-18381116529';
  var ADS_CONVERSION = 'AW-18381116529/nES9CILU3N8cEPGo5rxE';
  var DELAY_MS = 2500;

  function sendAdsConversion(gtagFn, callback) {
    var params = { send_to: ADS_CONVERSION };
    if (typeof callback === 'function') {
      params.event_callback = callback;
      params.event_timeout = 2000;
    }
    gtagFn('event', 'conversion', params);
  }

  function wrapGtag(gtagFn) {
    return function () {
      var args = arguments;
      gtagFn.apply(null, args);
      if (args[0] === 'event' && args[1] === 'download_click') {
        sendAdsConversion(gtagFn);
      }
    };
  }

  /**
   * Google Ads click snippet helper (same-tab). Prefer existing download_click
   * handlers for App Store links that open in a new tab.
   */
  window.gtag_report_conversion = function (url) {
    var gtagFn = typeof window.gtag === 'function' ? window.gtag : null;
    var callback = function () {
      if (typeof url !== 'undefined') {
        window.location = url;
      }
    };
    if (gtagFn) {
      sendAdsConversion(gtagFn, callback);
    } else if (typeof url !== 'undefined') {
      window.location = url;
    }
    return false;
  };

  // Early clicks (before gtag.js loads) still enqueue both events via the stub.
  if (typeof window.gtag === 'function') {
    window.gtag = wrapGtag(window.gtag);
  }

  function boot() {
    if (window.__transmovGtagInjected) return;
    window.__transmovGtagInjected = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    s.onload = function () {
      gtag('js', new Date());
      gtag('config', MEASUREMENT_ID);
      gtag('config', ADS_ID);
      window.gtag = wrapGtag(window.gtag);
    };
    document.head.appendChild(s);
  }

  setTimeout(boot, DELAY_MS);
})();
