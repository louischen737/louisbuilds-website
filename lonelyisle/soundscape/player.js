(function () {
  var catalog = window.LonelyIsleSoundscapes || [];
  var root = document.querySelector("[data-soundscape-id]");
  if (!root) return;

  var id = root.getAttribute("data-soundscape-id");
  var item = catalog.find(function (entry) {
    return entry.id === id;
  });
  if (!item) return;

  var audio = document.getElementById("soundscape-audio");
  var playBtn = document.getElementById("soundscape-play");
  var playIcon = document.getElementById("soundscape-play-icon");
  var disc = document.getElementById("soundscape-disc");
  var moreTrack = document.getElementById("soundscape-more-grid");
  var morePrev = document.getElementById("soundscape-more-prev");
  var moreNext = document.getElementById("soundscape-more-next");
  var playing = false;

  document.documentElement.style.setProperty("--ss-hue", String(item.hue || 210));

  if (item.cover && disc) {
    disc.style.backgroundImage =
      'linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.28)), url("' + item.cover + '")';
    disc.style.backgroundSize = "cover";
    disc.style.backgroundPosition = "center";
  }

  function setPlaying(next) {
    playing = next;
    if (playBtn) {
      playBtn.setAttribute("aria-pressed", playing ? "true" : "false");
      playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    }
    if (disc) disc.classList.toggle("is-spinning", playing);
    if (playIcon) {
      playIcon.innerHTML = playing
        ? '<rect x="3.6" y="2.8" width="3.4" height="10.4" rx="1.4"></rect><rect x="8.9" y="2.8" width="3.4" height="10.4" rx="1.4"></rect>'
        : '<path d="M5.05 2.85c-.92-.54-2.1.12-2.1 1.18v7.94c0 1.06 1.18 1.72 2.1 1.18l6.9-3.97c.9-.52.9-1.84 0-2.36L5.05 2.85z"></path>';
    }
  }

  var PREVIEW_LIMIT = 30;
  var interrupting = false;

  function ensurePreviewModal() {
    var existing = document.getElementById("soundscape-preview-modal");
    if (existing) return existing;

    var modal = document.createElement("div");
    modal.className = "ss-preview-modal";
    modal.id = "soundscape-preview-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "soundscape-preview-title");
    modal.innerHTML =
      '<div class="ss-preview-modal__card">' +
      '<button type="button" class="ss-preview-modal__close" aria-label="Close">' +
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>' +
      "</button>" +
      '<img class="ss-preview-modal__icon" src="../icon.png" width="64" height="64" alt="">' +
      '<h2 class="ss-preview-modal__title" id="soundscape-preview-title">Download LonelyIsle</h2>' +
      '<p class="ss-preview-modal__text">Step into LonelyIsle for the full soundscape</p>' +
      '<a class="ss-preview-modal__store" href="https://apps.apple.com/app/id6779457751" target="_blank" rel="noopener noreferrer">' +
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.7 8.3c0-1.7 1.4-2.5 1.5-2.6-0.8-1.2-2.1-1.3-2.5-1.3-1.1-0.1-2.1 0.6-2.6 0.6s-1.4-0.6-2.3-0.6c-1.2 0-2.3 0.7-2.9 1.8-1.2 2.2-0.3 5.4 0.9 7.1 0.6 0.9 1.3 1.8 2.2 1.8 0.9 0 1.2-0.6 2.3-0.6s1.4 0.6 2.3 0.6 1.6-0.9 2.2-1.8c0.7-1 1-2 1-2.1-0.1 0-1.9-0.7-1.9-2.9zM9.9 3.4c0.5-0.6 0.8-1.4 0.7-2.2-0.7 0-1.5 0.5-2 1.1-0.4 0.5-0.8 1.4-0.7 2.2 0.8 0.1 1.5-0.4 2-1.1z"/></svg>' +
      "<span>App Store</span>" +
      "</a>" +
      "</div>";
    document.body.appendChild(modal);

    function closeModal() {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    modal.querySelector(".ss-preview-modal__close").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    return modal;
  }

  function openPreviewModal() {
    var modal = ensurePreviewModal();
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function interruptPreview() {
    if (interrupting || !audio) return;
    interrupting = true;
    try {
      audio.pause();
      if (audio.currentTime < PREVIEW_LIMIT) audio.currentTime = PREVIEW_LIMIT;
    } catch (err) {}
    setPlaying(false);
    openPreviewModal();
    setTimeout(function () {
      interrupting = false;
    }, 400);
  }

  if (playBtn && audio) {
    audio.loop = false;
    audio.removeAttribute("loop");

    playBtn.addEventListener("click", function () {
      if (playing) {
        audio.pause();
        setPlaying(false);
        return;
      }
      if (audio.currentTime >= PREVIEW_LIMIT - 0.05) {
        audio.currentTime = 0;
      }
      var start = audio.play();
      if (start && typeof start.then === "function") {
        start.then(function () { setPlaying(true); }).catch(function () { setPlaying(false); });
      } else {
        setPlaying(true);
      }
    });

    audio.addEventListener("timeupdate", function () {
      if (!audio.paused && audio.currentTime >= PREVIEW_LIMIT) {
        interruptPreview();
      }
    });

    audio.addEventListener("ended", function () {
      setPlaying(false);
      openPreviewModal();
    });

    audio.addEventListener("pause", function () {
      if (!interrupting && !audio.ended) setPlaying(false);
    });
  }

  /* Infinite carousel invariant:
     At rest the track is always at translateX(0).
     Next: slide left by one card, then move that card to the end and reset.
     Prev: move last card to front (offset left by one), then slide back to 0. */
  var moreBusy = false;
  var MORE_MS = 320;

  function getMoreStep() {
    if (!moreTrack || !moreTrack.children.length) return 0;
    var card = moreTrack.children[0];
    var styles = window.getComputedStyle(moreTrack);
    var gap = parseFloat(styles.columnGap || styles.gap) || 20;
    return card.getBoundingClientRect().width + gap;
  }

  function setTrackX(x, animate) {
    moreTrack.style.transition = animate
      ? "transform " + MORE_MS + "ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";
    moreTrack.style.transform = "translate3d(" + x + "px, 0, 0)";
  }

  function afterTransition(done) {
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      moreTrack.removeEventListener("transitionend", onEnd);
      done();
    }
    function onEnd(e) {
      if (e.target !== moreTrack || e.propertyName !== "transform") return;
      finish();
    }
    moreTrack.addEventListener("transitionend", onEnd);
    setTimeout(finish, MORE_MS + 80);
  }

  function scrollMore(dir) {
    if (!moreTrack || moreBusy) return;
    if (moreTrack.children.length < 2) return;

    var step = getMoreStep();
    if (step <= 0) return;
    moreBusy = true;

    if (dir > 0) {
      // Leftmost card exits left; next card takes its place.
      setTrackX(-step, true);
      afterTransition(function () {
        moreTrack.appendChild(moreTrack.firstElementChild);
        setTrackX(0, false);
        moreBusy = false;
      });
      return;
    }

    // Rightmost card becomes the new leftmost, then slides in from the left.
    moreTrack.insertBefore(moreTrack.lastElementChild, moreTrack.firstElementChild);
    setTrackX(-step, false);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTrackX(0, true);
        afterTransition(function () {
          moreBusy = false;
        });
      });
    });
  }

  if (moreTrack) {
    var related = catalog
      .filter(function (entry) {
        if (entry.id === item.id) return false;
        return (entry.categories || []).some(function (cat) {
          return (item.categories || []).indexOf(cat) !== -1;
        });
      });

    catalog.forEach(function (entry) {
      if (entry.id === item.id) return;
      if (related.some(function (r) { return r.id === entry.id; })) return;
      related.push(entry);
    });

    moreTrack.innerHTML = related
      .map(function (entry) {
        return (
          '<a class="ss-listen__more-card" href="' + entry.id + '.html">' +
          '<div class="ss-listen__more-card-cover' + (entry.cover ? " has-cover" : "") +
          '" style="--ss-hue:' + entry.hue +
          (entry.cover ? ";background-image:url('" + entry.cover + "')" : "") +
          '" aria-hidden="true"></div>' +
          '<h3 class="ss-listen__more-card-title">' + entry.title + "</h3>" +
          "</a>"
        );
      })
      .join("");

    if (morePrev) morePrev.addEventListener("click", function () { scrollMore(-1); });
    if (moreNext) moreNext.addEventListener("click", function () { scrollMore(1); });
  }

  setPlaying(false);
})();
