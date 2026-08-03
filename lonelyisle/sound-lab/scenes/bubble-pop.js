(function () {
    'use strict';

    var S = window.SoundLabScene;
    var roundRect = S.roundRect;
    var canvas = document.querySelector('[data-scene-canvas]');
    if (!canvas) return;

    S.bootScene();

    var pal = {
        air: '#080D1A',
        waterTop: 'rgba(0,242,254,0.55)',
        waterBottom: 'rgba(79,79,229,0.78)',
        straw: '#FF4D4D',
        glow: 'rgba(0,242,254,0.2)',
        burstAccent: 'rgba(0,242,254,0.34)'
    };
    var bubbles = [];
    var spawnAccumulator = 0;
    var nextSpawnInterval = 0.45;
    var maxActiveBubbles = 12;
    var fadeDepth = 36;
    var ices = [
        { nx: 0.18, ny: 0.78, s: 0.11, rot: 15, spin: 0.08 },
        { nx: 0.72, ny: 0.58, s: 0.1, rot: -20, spin: -0.1 },
        { nx: 0.32, ny: 0.5, s: 0.095, rot: 28, spin: 0.06 },
        { nx: 0.86, ny: 0.82, s: 0.09, rot: -32, spin: -0.07 },
        { nx: 0.48, ny: 0.7, s: 0.085, rot: 12, spin: 0.05 }
    ];

    function strawGeom(w, h) {
        var strawW = w * (18 / 390);
        var topX = w * (280 / 390) + strawW * 0.5;
        var topY = h * (-20 / 844);
        var rad = (11.5 * Math.PI) / 180;
        var tipY = h - h * (65 / 844);
        var len = Math.min(h * (800 / 844), Math.max(0, (tipY - topY) / Math.max(Math.cos(rad), 0.001)));
        return {
            w: strawW,
            topX: topX,
            topY: topY,
            rad: rad,
            len: len,
            tipX: topX - Math.sin(rad) * len,
            tipY: topY + Math.cos(rad) * len,
            topR: strawW * 0.55
        };
    }

    function strawPath(ctx, width, length, topR) {
        var r = Math.min(topR, width * 0.5);
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(width - r, 0);
        ctx.quadraticCurveTo(width, 0, width, r);
        ctx.lineTo(width, length);
        ctx.lineTo(0, length);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
    }

    function paintStraw(ctx, s, stripe) {
        var period = s.w * 1.6;
        ctx.save();
        ctx.translate(s.topX + 3, s.topY + 3);
        ctx.rotate(s.rad);
        ctx.translate(-s.w / 2, 0);
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        strawPath(ctx, s.w, s.len, s.topR);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(s.topX, s.topY);
        ctx.rotate(s.rad);
        ctx.translate(-s.w / 2, 0);
        strawPath(ctx, s.w, s.len, s.topR);
        ctx.clip();
        for (var x = -period; x < s.w + period; x += period) {
            ctx.fillStyle = stripe;
            ctx.fillRect(x, 0, period * 0.5, s.len);
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + period * 0.5, 0, period * 0.5, s.len);
        }
        ctx.restore();
    }

    function drawIce(ctx, cx, cy, size, rot) {
        var half = size * 0.5;
        var corner = size * 0.2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((rot * Math.PI) / 180);
        var rg = ctx.createRadialGradient(-size * 0.12, -size * 0.14, size * 0.05, 0, 0, size * 0.72);
        rg.addColorStop(0, 'rgba(255,255,255,0.34)');
        rg.addColorStop(0.35, 'rgba(255,255,255,0.18)');
        rg.addColorStop(0.7, 'rgba(255,255,255,0.1)');
        rg.addColorStop(1, 'rgba(255,255,255,0.04)');
        ctx.fillStyle = rg;
        roundRect(ctx, -half, -half, size, size, corner);
        ctx.fill();
        var inset = size * 0.14;
        var ig = ctx.createRadialGradient(-size * 0.08, -size * 0.1, 0, 0, 0, size * 0.42);
        ig.addColorStop(0, 'rgba(255,255,255,0.28)');
        ig.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = ig;
        roundRect(ctx, -half + inset, -half + inset, size - inset * 2, size - inset * 2, corner * 0.65);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = Math.max(0.75, size * 0.022);
        roundRect(ctx, -half, -half, size, size, corner);
        ctx.stroke();
        ctx.restore();
    }

    function spawnBubble(tipX, tipY) {
        if (bubbles.length >= maxActiveBubbles) return;
        bubbles.push({
            x: tipX + (Math.random() - 0.5) * 6,
            y: tipY,
            radius: 5 + Math.random() * 8,
            // Simple upward float — fade out at the surface (no burst).
            speed: 38 + Math.random() * 28,
            sway: (Math.random() - 0.5) * 10,
            phase: Math.random() * Math.PI * 2,
            age: 0
        });
    }

    function updateBubbles(dt, surfaceY) {
        for (var i = bubbles.length - 1; i >= 0; i--) {
            var b = bubbles[i];
            b.age += dt;
            b.y -= b.speed * dt;
            b.x += Math.sin(b.age * 2.2 + b.phase) * b.sway * dt;

            if (b.y + b.radius < surfaceY - 4) {
                bubbles.splice(i, 1);
            }
        }
    }

    function drawBubble(ctx, b, surfaceY) {
        var distanceToSurface = Math.max(0, b.y - surfaceY);
        var surfaceFade = Math.min(1, distanceToSurface / fadeDepth);
        var opacity = 0.78 * surfaceFade;
        if (b.age < 0.12) opacity *= b.age / 0.12;
        if (opacity <= 0.02) return;

        var radius = b.radius * (0.92 + surfaceFade * 0.08);
        var rg = ctx.createRadialGradient(
            b.x - radius * 0.18,
            b.y - radius * 0.22,
            0,
            b.x,
            b.y,
            radius
        );
        rg.addColorStop(0, 'rgba(255,255,255,' + (0.4 * opacity) + ')');
        rg.addColorStop(0.55, 'rgba(255,255,255,' + (0.12 * opacity) + ')');
        rg.addColorStop(1, 'rgba(255,255,255,' + (0.03 * opacity) + ')');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,' + (0.25 * opacity) + ')';
        ctx.lineWidth = Math.max(0.4, radius * 0.04);
        ctx.beginPath();
        ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    function draw(now, dt) {
        S.resizeCanvas(canvas);
        var w = canvas._cssW;
        var h = canvas._cssH;
        var ctx = canvas.getContext('2d');
        var waterY = h / 3;
        var s = strawGeom(w, h);
        var t = now / 1000;

        ctx.fillStyle = pal.air;
        ctx.fillRect(0, 0, w, h);

        paintStraw(ctx, s, pal.straw);

        var wg = ctx.createLinearGradient(0, waterY, 0, h);
        wg.addColorStop(0, pal.waterTop);
        wg.addColorStop(1, pal.waterBottom);
        ctx.fillStyle = wg;
        ctx.fillRect(0, waterY, w, h - waterY);

        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, waterY);
        ctx.lineTo(w, waterY);
        ctx.stroke();

        for (var i = 0; i < ices.length; i++) {
            var ice = ices[i];
            if (!S.reducedMotion) ice.rot += ice.spin * dt * 60;
            var isize = Math.min(w, h) * ice.s;
            var ix = ice.nx * w + (S.reducedMotion ? 0 : Math.sin(t * 0.7 + i) * 4);
            var iy = ice.ny * h + (S.reducedMotion ? 0 : Math.cos(t * 0.55 + i) * 3);
            if (iy - isize * 0.5 < waterY + 4) iy = waterY + isize * 0.55;
            drawIce(ctx, ix, iy, isize, ice.rot);
        }

        if (!S.reducedMotion) {
            spawnAccumulator += dt;
            if (spawnAccumulator >= nextSpawnInterval) {
                spawnAccumulator = 0;
                nextSpawnInterval = 0.25 + Math.random() * 0.65;
                spawnBubble(s.tipX, s.tipY);
            }
            updateBubbles(dt, waterY);
        }

        // Soft emitter glow at straw tip (App)
        var tipGlow = ctx.createRadialGradient(s.tipX, s.tipY, 0, s.tipX, s.tipY, 10);
        tipGlow.addColorStop(0, 'rgba(255,255,255,0.22)');
        tipGlow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = tipGlow;
        ctx.beginPath();
        ctx.arc(s.tipX, s.tipY, 10, 0, Math.PI * 2);
        ctx.fill();

        for (var bi = 0; bi < bubbles.length; bi++) {
            drawBubble(ctx, bubbles[bi], waterY);
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, waterY);
        ctx.clip();
        paintStraw(ctx, s, pal.straw);
        ctx.restore();
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
        window.addEventListener('resize', function () {
            draw(performance.now(), 0);
        });
    } else {
        requestAnimationFrame(frame);
    }
})();
