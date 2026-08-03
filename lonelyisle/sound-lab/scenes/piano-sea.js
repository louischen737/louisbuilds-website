(function () {
    'use strict';

    var S = window.SoundLabScene;
    var canvas = document.querySelector('[data-scene-canvas]');
    if (!canvas) return;

    var audioApi = S.bootScene();

    var WHITE_MIDIS = [53, 55, 57, 60, 62, 64, 65, 67, 69, 72, 74, 76, 77, 79, 81];
    var BLACK_MIDIS = [54, 56, 58, 59, 61, 63, 66, 68, 70, 71, 73, 75, 78, 80, 82];
    var BLACK_ANCHORS = [0, 1, 2, 2, 3, 4, 6, 7, 8, 8, 9, 10, 12, 13, 14];
    var events = (window.PianoSeaScore && window.PianoSeaScore.events) || [];
    var nextEvent = 0;
    var lastTime = 0;
    var whiteLit = {};
    var blackLit = {};
    var jellies = [];

    /** Match App PianoSeaLayout.resolve for the workspace size. */
    function resolveLayout(w, h) {
        var isLandscape = w > h;
        var isPad = w >= 500 || h >= 500;
        var keyFrac;
        var jellyScale;
        var jellySpeed;
        var launchMin;
        var launchSpan;
        if (isPad && isLandscape) {
            keyFrac = 0.12;
            jellyScale = 1.12;
            jellySpeed = 1.15;
            launchMin = 78;
            launchSpan = 34;
        } else if (isPad) {
            keyFrac = 0.13;
            jellyScale = 1.15;
            jellySpeed = 1.42;
            launchMin = 84;
            launchSpan = 40;
        } else {
            keyFrac = 0.15;
            jellyScale = 1.0;
            jellySpeed = 1.58;
            launchMin = 72;
            launchSpan = 36;
        }
        var keyHeight = h * keyFrac;
        return {
            keyHeight: keyHeight,
            pianoY: h - keyHeight,
            jellyScale: jellyScale,
            jellySpeed: jellySpeed,
            launchMin: launchMin,
            launchSpan: launchSpan,
            // App launch is in points; scale slightly with taller web workspaces.
            heightScale: Math.min(Math.max(h / 780, 0.85), 1.25)
        };
    }

    function midiToKey(midi) {
        var wi = WHITE_MIDIS.indexOf(midi);
        if (wi >= 0) return { black: false, index: wi };
        var bi = BLACK_MIDIS.indexOf(midi);
        if (bi >= 0) return { black: true, index: bi };
        return null;
    }

    function spawnJelly(layout, keyX, hue) {
        var baseScale = (0.17 + Math.random() * 0.07) * layout.jellyScale;
        var speedY = (0.35 + Math.random() * 0.3) * layout.jellySpeed;
        var startY = layout.pianoY + layout.keyHeight * 0.1;
        var launch = (layout.launchMin + Math.random() * layout.launchSpan) *
            layout.jellySpeed * layout.heightScale;
        var tentacles = [];
        for (var t = 0; t < 3; t++) {
            // Slightly fewer nodes than App (10–12) so trails stay shorter on the larger web stage.
            var nodeCount = 7 + Math.floor(Math.random() * 3);
            var offset = t / 2 - 0.5;
            var nodes = [];
            for (var n = 0; n < nodeCount; n++) {
                nodes.push({ x: keyX, y: startY });
            }
            tentacles.push({ offsetFraction: offset, nodes: nodes });
        }
        jellies.push({
            x: keyX,
            y: startY,
            scale: baseScale,
            speedY: speedY,
            phase: 'launching',
            phaseElapsed: 0,
            breathDuration: 1.5 + Math.random() * 0.7,
            glideDuration: 1.2 + Math.random() * 0.8,
            launchTravelTotal: launch,
            launchTravelRemaining: launch,
            alpha: 1,
            hue: hue,
            currentScaleX: baseScale * 1.12,
            currentScaleY: baseScale * 0.84,
            tentacles: tentacles
        });
    }

    function jellyMotionProfile(jelly) {
        if (jelly.phase === 'launching') {
            var progress = 1 - Math.min(Math.max(jelly.launchTravelRemaining / Math.max(jelly.launchTravelTotal, 1), 0), 1);
            var stretch = Math.max(0.14 - progress * 0.1, 0.02);
            return {
                scaleX: jelly.scale * (1 + stretch),
                scaleY: jelly.scale * (1 - stretch * 0.95),
                speedFactor: 3.35
            };
        }
        if (jelly.phase === 'breathing') {
            var p = Math.min(Math.max(jelly.phaseElapsed / jelly.breathDuration, 0), 1);
            var breath = Math.sin(p * Math.PI);
            return {
                scaleX: jelly.scale * (1 - breath * 0.13),
                scaleY: jelly.scale * (1 + breath * 0.09),
                speedFactor: 0.62 + (1 - breath) * 0.18
            };
        }
        return { scaleX: jelly.scale, scaleY: jelly.scale, speedFactor: 1 };
    }

    function advanceJellyPhase(jelly, delta, traveled) {
        if (jelly.phase === 'launching') {
            jelly.launchTravelRemaining = Math.max(0, jelly.launchTravelRemaining - traveled);
            if (jelly.launchTravelRemaining <= 0) {
                jelly.phase = 'breathing';
                jelly.phaseElapsed = 0;
            }
            return;
        }
        if (jelly.phase === 'breathing') {
            jelly.phaseElapsed += delta;
            if (jelly.phaseElapsed >= jelly.breathDuration) {
                jelly.phase = 'gliding';
                jelly.phaseElapsed = 0;
            }
            return;
        }
        jelly.phaseElapsed += delta;
        if (jelly.phaseElapsed >= jelly.glideDuration) {
            jelly.phase = 'breathing';
            jelly.phaseElapsed = 0;
        }
    }

    function updateJellies(dt, h) {
        // App subtracts speedY once per display tick (~60fps). Normalize with dt.
        var frameScale = dt * 60;
        for (var i = jellies.length - 1; i >= 0; i--) {
            var jelly = jellies[i];
            var profile = jellyMotionProfile(jelly);
            var currentSpeedY = jelly.speedY * profile.speedFactor;
            var step = currentSpeedY * frameScale;
            jelly.y -= step;
            jelly.currentScaleX = profile.scaleX;
            jelly.currentScaleY = profile.scaleY;

            var headWidth = 32 * jelly.currentScaleX;
            var headHeight = 12 * jelly.currentScaleY;
            for (var t = 0; t < jelly.tentacles.length; t++) {
                var tent = jelly.tentacles[t];
                var targetX = jelly.x + tent.offsetFraction * headWidth * 0.8;
                var targetY = jelly.y + headHeight * 0.5;
                // Cap trail stretch during launch so silk doesn't become long vertical streaks.
                var trailPush = Math.min(step, 1.6) * 0.32;
                for (var n = 0; n < tent.nodes.length; n++) {
                    if (n === 0) {
                        tent.nodes[n].x = targetX;
                        tent.nodes[n].y = targetY;
                    } else {
                        var prev = tent.nodes[n - 1];
                        var node = tent.nodes[n];
                        var dx = prev.x - node.x;
                        var dy = prev.y - node.y;
                        // Slightly snappier follow than App 0.22 → shorter settled length on web.
                        node.x += dx * 0.28;
                        node.y += dy * 0.28 + trailPush;
                    }
                }
            }

            if (jelly.y < h * 0.155) {
                jelly.alpha -= 0.007 * frameScale;
            }

            advanceJellyPhase(jelly, dt, step);

            if (jelly.alpha <= 0 || jelly.y < -30) {
                jellies.splice(i, 1);
            }
        }
    }

    function drawJelly(ctx, jelly) {
        var rX = 30 * jelly.currentScaleX;
        var rY = 22 * jelly.currentScaleY;
        ctx.save();
        ctx.globalAlpha = Math.max(0, jelly.alpha);

        var glowR = rX * 1.5;
        var glow = ctx.createRadialGradient(jelly.x, jelly.y, 1, jelly.x, jelly.y, glowR);
        glow.addColorStop(0, 'hsla(' + jelly.hue + ',90%,92%,0.48)');
        glow.addColorStop(0.5, 'hsla(' + jelly.hue + ',90%,92%,0.12)');
        glow.addColorStop(1, 'hsla(' + jelly.hue + ',90%,92%,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(jelly.x, jelly.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // App: baseWidth = max(0.55, 0.9 * scale), segmentAlpha 0.36 * (1 - t²) — no ×4.
        var baseW = Math.max(0.45, 0.75 * jelly.scale);
        for (var t = 0; t < jelly.tentacles.length; t++) {
            var nodes = jelly.tentacles[t].nodes;
            for (var i = 1; i < nodes.length; i++) {
                var segT = i / (nodes.length - 1);
                var segmentAlpha = 0.26 * (1 - segT * segT);
                ctx.strokeStyle = 'hsla(' + jelly.hue + ',80%,88%,' + segmentAlpha + ')';
                ctx.lineWidth = baseW * (1 - segT * 0.65);
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(nodes[i - 1].x, nodes[i - 1].y);
                ctx.lineTo(nodes[i].x, nodes[i].y);
                ctx.stroke();
            }
        }

        ctx.beginPath();
        ctx.moveTo(jelly.x - rX, jelly.y + rY * 0.1);
        ctx.bezierCurveTo(jelly.x - rX, jelly.y - rY, jelly.x + rX, jelly.y - rY, jelly.x + rX, jelly.y + rY * 0.1);
        ctx.bezierCurveTo(jelly.x + rX * 0.6, jelly.y + rY * 0.4, jelly.x - rX * 0.6, jelly.y + rY * 0.4, jelly.x - rX, jelly.y + rY * 0.1);
        ctx.closePath();
        ctx.fillStyle = 'hsla(' + jelly.hue + ',85%,82%,0.68)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.78)';
        ctx.lineWidth = Math.max(0.4, 0.55 * jelly.scale);
        ctx.stroke();
        ctx.restore();
    }

    function processScore(time, layout, w) {
        if (time + 1 < lastTime) {
            nextEvent = 0;
            whiteLit = {};
            blackLit = {};
        }
        lastTime = time;
        while (nextEvent < events.length && events[nextEvent].time <= time + 0.05) {
            var ev = events[nextEvent++];
            var key = midiToKey(ev.midi);
            if (!key) continue;
            var hue = 195 + Math.random() * 15;
            var keyW = w / 15;
            if (key.black) {
                blackLit[key.index] = time + Math.max(0.22, ev.duration * 0.5);
                var anchor = BLACK_ANCHORS[key.index];
                spawnJelly(layout, anchor * keyW + keyW * 0.72 + keyW * 0.28, hue);
            } else {
                whiteLit[key.index] = time + Math.max(0.22, ev.duration * 0.5);
                spawnJelly(layout, (key.index + 0.5) * keyW, hue);
            }
        }
    }

    function draw(now, dt) {
        S.resizeCanvas(canvas);
        var w = canvas._cssW;
        var h = canvas._cssH;
        var ctx = canvas.getContext('2d');
        var layout = resolveLayout(w, h);
        var keyH = layout.keyHeight;
        var pianoY = layout.pianoY;
        var time = audioApi.audio ? audioApi.audio.currentTime : 0;

        ctx.fillStyle = '#020205';
        ctx.fillRect(0, 0, w, h);

        var aura = ctx.createLinearGradient(0, pianoY - h * 0.45, 0, pianoY);
        aura.addColorStop(0, 'rgba(40,140,255,0)');
        aura.addColorStop(1, 'rgba(80,190,255,0.22)');
        ctx.fillStyle = aura;
        ctx.fillRect(0, pianoY - h * 0.45, w, h * 0.45);

        processScore(time, layout, w);

        if (!S.reducedMotion) {
            updateJellies(dt, h);
        }

        for (var k = 0; k < jellies.length; k++) drawJelly(ctx, jellies[k]);

        var keyW = w / 15;
        for (var i = 0; i < 15; i++) {
            var lit = whiteLit[i] && whiteLit[i] > time;
            ctx.fillStyle = lit ? '#B8E8FF' : '#F8F8FF';
            ctx.fillRect(i * keyW + 0.5, pianoY, keyW - 1, keyH);
            if (lit) {
                ctx.strokeStyle = 'rgba(255,220,100,0.7)';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(i * keyW + 1, pianoY + 1, keyW - 2, keyH - 2);
            }
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect((i + 1) * keyW - 1, pianoY, 1, keyH);
        }

        var bw = keyW * 0.56;
        var bh = keyH * 0.6;
        for (var b = 0; b < BLACK_ANCHORS.length; b++) {
            var litB = blackLit[b] && blackLit[b] > time;
            var bx = BLACK_ANCHORS[b] * keyW + keyW * 0.72;
            ctx.fillStyle = litB ? '#3A4A6A' : '#080A12';
            ctx.fillRect(bx, pianoY, bw, bh);
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.fillRect(bx + 1, pianoY, Math.max(bw - 2, 1), 5);
            if (litB) {
                ctx.strokeStyle = 'rgba(255,220,100,0.55)';
                ctx.lineWidth = 1;
                ctx.strokeRect(bx, pianoY, bw, bh);
            }
        }
    }

    var last = performance.now();
    function frame(now) {
        var dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        draw(now, dt);
        if (!S.reducedMotion) requestAnimationFrame(frame);
    }

    S.resizeCanvas(canvas);
    if (S.reducedMotion) {
        draw(performance.now(), 0);
        window.addEventListener('resize', function () { draw(performance.now(), 0); });
    } else {
        requestAnimationFrame(frame);
    }
})();
