(function () {
  var modal = document.getElementById('app-qr-modal');
  if (!modal) return;

  var triggers = document.querySelectorAll('.hero-qr-trigger, [data-app-qr-open]');
  var closeEls = modal.querySelectorAll('[data-app-qr-close]');
  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      modal.classList.add('is-open');
    });
    document.body.classList.add('app-qr-modal-open');
    var closeBtn = modal.querySelector('.app-qr-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('app-qr-modal-open');
    modal.setAttribute('aria-hidden', 'true');
    window.setTimeout(function () {
      if (!modal.classList.contains('is-open')) {
        modal.hidden = true;
      }
    }, 280);
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  triggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  closeEls.forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();
