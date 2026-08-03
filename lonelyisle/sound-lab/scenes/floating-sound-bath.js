(function () {
    'use strict';

    var S = window.SoundLabScene;
    var roundRect = S.roundRect;
    var canvas = document.querySelector('[data-scene-canvas]');
    if (!canvas) return;

    S.bootScene();

    var raft = {
        x: 0.5,
        y: 0.5,
        vx: 0.85,
        vy: -0.53,
        bobOffset: 0,
        bobSpeed: 0.012
    };
    var ripples = [];
    var nextRipple = 0.8;
    var DRIFT_SPEED = 11; /* App: points per second */

    function normalizeDir() {
        var len = Math.hypot(raft.vx, raft.vy);
        if (len > 0.001) {
            raft.vx /= len;
            raft.vy /= len;
        } else {
            raft.vx = 0.85;
            raft.vy = -0.53;
            normalizeDir();
        }
    }

    normalizeDir();

    function drawKoalaHead(ctx, scale, ox, oy) {
        ctx.save();
        ctx.translate(ox, oy);
        var earYs = [-18, 18];
        for (var i = 0; i < earYs.length; i++) {
            ctx.fillStyle = '#B2BABF';
            ctx.beginPath();
            ctx.ellipse((-12) * scale, earYs[i] * scale, 12 * scale, 12 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#F5C7C7';
            ctx.beginPath();
            ctx.ellipse((-12) * scale, earYs[i] * scale, 7 * scale, 7 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#C7D1D9';
        ctx.beginPath();
        ctx.ellipse(0, 0, 22 * scale, 22 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#66527A';
        roundRect(ctx, -11 * scale, -18 * scale, 11 * scale, 36 * scale, 5 * scale);
        ctx.fill();
        ctx.strokeStyle = '#66527A';
        ctx.lineWidth = 1.5 * scale;
        ctx.beginPath();
        ctx.moveTo(-5 * scale, -18 * scale);
        ctx.lineTo(-12 * scale, -20 * scale);
        ctx.moveTo(-5 * scale, 18 * scale);
        ctx.lineTo(-12 * scale, 20 * scale);
        ctx.stroke();
        ctx.fillStyle = '#383838';
        roundRect(ctx, 0, -6 * scale, 11 * scale, 12 * scale, 5.5 * scale);
        ctx.fill();
        ctx.strokeStyle = '#F0B899';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(-5 * scale, -9 * scale, 3 * scale, Math.PI / 2, -Math.PI / 2, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-5 * scale, 9 * scale, 3 * scale, Math.PI / 2, -Math.PI / 2, false);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,0,0,0.28)';
        ctx.beginPath();
        ctx.ellipse(5.5 * scale, -12 * scale, 3.5 * scale, 3.5 * scale, 0, 0, Math.PI * 2);
        ctx.ellipse(5.5 * scale, 12 * scale, 3.5 * scale, 3.5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function draw(now, dt) {
        S.resizeCanvas(canvas);
        var w = canvas._cssW;
        var h = canvas._cssH;
        var ctx = canvas.getContext('2d');
        var t = now / 1000;
        var breath = Math.sin(t * 0.35) * 0.5 + 0.5;

        var g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, 'rgba(115,199,235,' + (0.92 + 0.08 * breath) + ')');
        g.addColorStop(0.55, '#52B2E0');
        g.addColorStop(1, '#61BDE6');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 1.5;
        for (var i = 0; i < 5; i++) {
            var yBase = h * (0.12 + i * 0.16);
            var amp = 8 + i * 2;
            var phase = t * 0.18 + i * 0.85;
            ctx.beginPath();
            for (var x = 0; x <= w; x += 8) {
                var y = yBase + Math.sin(x * 0.014 + phase) * amp;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        var rim = Math.min(w, h) * 0.14;
        var shortSide = Math.min(w, h);
        [[0, 0, w, rim, 0, 1], [0, h - rim, w, rim, 1, 0], [0, 0, rim, h, 0, 1], [w - rim, 0, rim, h, 1, 0]].forEach(function (band, idx) {
            var lg;
            if (idx < 2) lg = ctx.createLinearGradient(0, band[1], 0, band[1] + band[3]);
            else lg = ctx.createLinearGradient(band[0], 0, band[0] + band[2], 0);
            lg.addColorStop(band[4], 'rgba(255,255,255,0.22)');
            lg.addColorStop(band[5], 'rgba(255,255,255,0)');
            ctx.fillStyle = lg;
            ctx.fillRect(band[0], band[1], band[2], band[3]);
        });

        if (!S.reducedMotion) {
            normalizeDir();
            /* Normalized position: convert App pt/s → fraction of viewport per second */
            var stepX = (DRIFT_SPEED * dt) / w;
            var stepY = (DRIFT_SPEED * dt) / h;
            var nextX = raft.x + raft.vx * stepX;
            var nextY = raft.y + raft.vy * stepY;

            /* Play bounds: inset by half mattress (approx phone ratios) */
            var padX = (shortSide * (w < 600 ? 0.34 : 0.22) * 0.5) / w;
            var padY = (shortSide * (w < 600 ? 0.125 : 0.08) * 0.5) / h;
            var minX = padX;
            var maxX = 1 - padX;
            var minY = padY;
            var maxY = 1 - padY;

            var bounced = false;
            var bounceNX = 0;
            var bounceNY = 0;

            if (nextX < minX) {
                nextX = minX;
                raft.vx = Math.abs(raft.vx);
                bounceNX = 1;
                bounced = true;
            } else if (nextX > maxX) {
                nextX = maxX;
                raft.vx = -Math.abs(raft.vx);
                bounceNX = -1;
                bounced = true;
            }

            if (nextY < minY) {
                nextY = minY;
                raft.vy = Math.abs(raft.vy);
                bounceNY = 1;
                bounced = true;
            } else if (nextY > maxY) {
                nextY = maxY;
                raft.vy = -Math.abs(raft.vy);
                bounceNY = -1;
                bounced = true;
            }

            if (bounced) {
                /* App: nudge heading by a small random angle after bounce */
                var ang = (Math.random() * 0.8 - 0.4);
                var cosB = Math.cos(ang);
                var sinB = Math.sin(ang);
                var rx = raft.vx;
                var ry = raft.vy;
                raft.vx = rx * cosB - ry * sinB;
                raft.vy = rx * sinB + ry * cosB;
                normalizeDir();
                ripples.push({
                    x: nextX - bounceNX * (16 / w),
                    y: nextY - bounceNY * (16 / h),
                    born: t
                });
            }

            raft.x = nextX;
            raft.y = nextY;
            raft.bobOffset += raft.bobSpeed * (dt * 60);
            nextRipple -= dt;
            if (nextRipple <= 0) {
                ripples.push({ x: raft.x, y: raft.y + 0.02, born: t });
                nextRipple = 1.4 + Math.random() * 1.2;
            }
        }

        var bobY = Math.sin(raft.bobOffset) * 3;

        for (var ri = ripples.length - 1; ri >= 0; ri--) {
            var rp = ripples[ri];
            var age = t - rp.born;
            if (age > 1.8) {
                ripples.splice(ri, 1);
                continue;
            }
            var progress = age / 1.8;
            ctx.beginPath();
            ctx.arc(rp.x * w, rp.y * h, 6 + progress * 42, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,' + (0.35 * (1 - progress)) + ')';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        var mw = shortSide * (w < 600 ? 0.34 : 0.22);
        var mh = shortSide * (w < 600 ? 0.125 : 0.08);
        var cx = raft.x * w;
        var cy = raft.y * h + bobY;
        var corner = mh * 0.3;

        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        roundRect(ctx, cx - mw / 2 - mw * 0.07, cy - mh / 2 - mh * 0.22, mw, mh, corner);
        ctx.fill();

        ctx.fillStyle = '#242429';
        ctx.strokeStyle = '#0D0D0F';
        ctx.lineWidth = Math.max(2.6 * (mw / 96), 2);
        roundRect(ctx, cx - mw / 2, cy - mh / 2, mw, mh, corner);
        ctx.fill();
        ctx.stroke();

        var blanket = {
            x: cx - mw / 2 + mw * 0.28,
            y: cy - mh / 2 + 2,
            w: mw * 0.68,
            h: mh - 4
        };
        ctx.strokeStyle = '#3D3D45';
        ctx.lineWidth = Math.max(2.4 * (mw / 96), 2);
        for (var sx = cx - mw / 2 + mw * 0.14; sx < blanket.x - 2; sx += mw * 0.15) {
            ctx.beginPath();
            ctx.moveTo(sx, cy - mh / 2 + 5);
            ctx.lineTo(sx, cy + mh / 2 - 5);
            ctx.stroke();
        }
        ctx.fillStyle = '#525459';
        roundRect(ctx, blanket.x, blanket.y, blanket.w, blanket.h, mh * 0.22);
        ctx.fill();
        ctx.save();
        roundRect(ctx, blanket.x, blanket.y, blanket.w, blanket.h, mh * 0.22);
        ctx.clip();
        ctx.strokeStyle = '#383A42';
        for (var bx = blanket.x + blanket.w * 0.18; bx < blanket.x + blanket.w - 4; bx += Math.max(blanket.w * 0.14, 10)) {
            ctx.beginPath();
            ctx.moveTo(bx, blanket.y + 4);
            ctx.lineTo(bx, blanket.y + blanket.h - 4);
            ctx.stroke();
        }
        ctx.restore();

        var headScale = mh / 66;
        drawKoalaHead(ctx, headScale, cx - mw * 0.32, cy);

        var zCycle = (t % 6.2) / 6.2;
        if (zCycle < 0.5) {
            var zp = zCycle / 0.5;
            var letters = ['Z', 'z', 'z'];
            for (var zi = 0; zi < 3; zi++) {
                var delay = zi * 0.18;
                var lp = Math.max(0, Math.min(1, (zp - delay) / 0.55));
                if (lp <= 0) continue;
                ctx.globalAlpha = Math.sin(lp * Math.PI) * 0.7;
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.font = '700 ' + (13 - zi * 1.5) * headScale + 'px ui-monospace, Menlo, monospace';
                ctx.fillText(
                    letters[zi],
                    cx - mw * 0.32 + 2 * headScale + (6 + zi * 8) * headScale * lp,
                    cy - 22 * headScale - (10 + 34 * lp) * headScale
                );
                ctx.globalAlpha = 1;
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
