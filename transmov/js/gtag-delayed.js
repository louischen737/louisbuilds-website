/**
 * GA4: defer gtag.js fetch/parse to reduce main-thread contention (INP).
 * Requires inline stub: dataLayer + gtag() queue in HTML before this script.
 */
(function () {
  var MEASUREMENT_ID = 'G-2TMXET2TJN';
  var DELAY_MS = 2500;

  function boot() {
    if (window.__transmovGtagInjected) return;
    window.__transmovGtagInjected = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    s.onload = function () {
      gtag('js', new Date());
      gtag('config', MEASUREMENT_ID);
    };
    document.head.appendChild(s);
  }

  setTimeout(boot, DELAY_MS);
})();
