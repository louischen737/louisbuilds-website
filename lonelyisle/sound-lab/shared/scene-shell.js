(function (global) {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas(canvas) {
        var host = canvas.closest('.scene-workspace') || canvas.parentElement || document.body;
        var rect = host.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = Math.max(1, Math.round(rect.width));
        var h = Math.max(1, Math.round(rect.height));
        if (canvas._cssW === w && canvas._cssH === h && canvas._dpr === dpr) return false;
        canvas._cssW = w;
        canvas._cssH = h;
        canvas._dpr = dpr;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        var ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return true;
    }

    function fadeVolume(audio, from, to, durationMs, done) {
        if (!audio) {
            if (done) done();
            return;
        }
        if (reducedMotion || durationMs <= 0) {
            audio.volume = to;
            if (done) done();
            return;
        }
        var start = performance.now();
        audio.volume = from;
        function tick(now) {
            var t = Math.min(1, (now - start) / durationMs);
            var eased = t * t * (3 - 2 * t);
            audio.volume = from + (to - from) * eased;
            if (t < 1) requestAnimationFrame(tick);
            else if (done) done();
        }
        requestAnimationFrame(tick);
    }

    /**
     * Wire Touch-to-Listen overlay + optional chrome mute after unlock.
     * Returns { muted, setMuted, audio, currentTime, unlocked }
     */
    function bootScene(options) {
        options = options || {};
        var audio = options.audio || document.querySelector('[data-scene-audio]');
        var overlay = options.overlay || document.querySelector('[data-scene-overlay]');
        var unlockBtn = options.unlockBtn || document.querySelector('[data-scene-unmute]');
        var muteBtn = options.muteBtn || document.querySelector('[data-scene-mute]');

        var state = {
            muted: true,
            unlocked: false,
            audio: audio
        };

        if (!audio) {
            return {
                muted: function () { return true; },
                setMuted: function () {},
                audio: null,
                currentTime: function () { return 0; },
                unlocked: function () { return false; }
            };
        }

        audio.loop = true;
        audio.muted = true;
        audio.volume = 0;
        audio.preload = 'auto';

        function tryPlay() {
            var p = audio.play();
            if (p && p.catch) p.catch(function () {});
        }

        function syncMuteBtn() {
            if (!muteBtn) return;
            muteBtn.textContent = state.muted ? 'Unmute' : 'Mute';
            muteBtn.setAttribute('aria-pressed', state.muted ? 'true' : 'false');
        }

        function dismissOverlay() {
            if (overlay) overlay.classList.add('is-dismissed');
            if (muteBtn) muteBtn.classList.add('is-visible');
        }

        function unlockAndListen() {
            if (state.unlocked && !state.muted) return;
            state.unlocked = true;
            state.muted = false;
            audio.muted = false;
            tryPlay();
            fadeVolume(audio, Math.max(audio.volume, 0), 1, 900);
            dismissOverlay();
            syncMuteBtn();
        }

        function setMuted(muted) {
            if (!state.unlocked && !muted) {
                unlockAndListen();
                return;
            }
            state.muted = muted;
            if (muted) {
                fadeVolume(audio, audio.volume, 0, 350, function () {
                    audio.muted = true;
                });
            } else {
                audio.muted = false;
                tryPlay();
                fadeVolume(audio, audio.volume, 1, 500);
            }
            syncMuteBtn();
        }

        /* Soft muted autoplay so timeline (Piano Sea) can advance; stays silent until unlock */
        tryPlay();
        syncMuteBtn();

        function onUnlock(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            unlockAndListen();
        }

        if (overlay) overlay.addEventListener('click', onUnlock);
        if (unlockBtn) unlockBtn.addEventListener('click', onUnlock);

        if (muteBtn) {
            muteBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                setMuted(!state.muted);
            });
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                audio.pause();
            } else {
                tryPlay();
            }
        });

        return {
            muted: function () { return state.muted; },
            setMuted: setMuted,
            audio: audio,
            currentTime: function () { return audio.currentTime || 0; },
            unlocked: function () { return state.unlocked; }
        };
    }

    /* Back-compat aliases */
    function bootAudio(audio, muteBtn, hint) {
        return bootScene({ audio: audio, muteBtn: muteBtn });
    }

    function hideHintSoon() {}

    global.SoundLabScene = {
        reducedMotion: reducedMotion,
        resizeCanvas: resizeCanvas,
        bootScene: bootScene,
        bootAudio: bootAudio,
        hideHintSoon: hideHintSoon,
        roundRect: function (ctx, x, y, w, h, r) {
            var rr = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + rr, y);
            ctx.arcTo(x + w, y, x + w, y + h, rr);
            ctx.arcTo(x + w, y + h, x, y + h, rr);
            ctx.arcTo(x, y + h, x, y, rr);
            ctx.arcTo(x, y, x + w, y, rr);
            ctx.closePath();
        }
    };
})(window);
