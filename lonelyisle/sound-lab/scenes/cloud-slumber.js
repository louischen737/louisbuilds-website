(function () {
    'use strict';

    var S = window.SoundLabScene;
    var canvas = document.querySelector('[data-scene-canvas]');
    if (!canvas) return;

    S.bootScene();

    function unit(scene, x, y) {
        return {
            x: scene.x + (x / 360) * scene.w,
            y: scene.y + (y / 240) * scene.h
        };
    }

    function sceneRect(w, h) {
        var aspect = 360 / 240;
        var sh = h * 0.34;
        var sw = sh * aspect;
        if (sw > w * 0.86) {
            sw = w * 0.86;
            sh = sw / aspect;
        }
        return {
            x: (w - sw) * 0.5,
            y: h - h * 0.22 - sh,
            w: sw,
            h: sh
        };
    }

    function drawCloud(ctx, scene) {
        function curve(pts) {
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (var i = 1; i < pts.length; i += 3) {
                ctx.bezierCurveTo(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, pts[i + 2].x, pts[i + 2].y);
            }
            ctx.closePath();
        }
        var p = function (x, y) { return unit(scene, x, y); };
        ctx.fillStyle = '#E5E5EA';
        curve([p(35, 165), p(25, 120), p(80, 105), p(180, 105), p(280, 105), p(335, 120), p(325, 165), p(315, 205), p(270, 215), p(180, 215), p(90, 215), p(45, 205), p(35, 165)]);
        ctx.fill();
        ctx.fillStyle = '#fff';
        curve([p(35, 160), p(25, 115), p(80, 100), p(180, 100), p(280, 100), p(335, 115), p(325, 160), p(315, 200), p(270, 210), p(180, 210), p(90, 210), p(45, 200), p(35, 160)]);
        ctx.fill();
    }

    function drawCat(ctx, scene) {
        var offX = 20;
        var offY = 15;
        var p = function (x, y) { return unit(scene, x + offX, y + offY); };
        ctx.fillStyle = '#1C1C1E';
        ctx.beginPath();
        var m = p(62, 145);
        ctx.moveTo(m.x, m.y);
        ctx.bezierCurveTo(p(52, 115).x, p(52, 115).y, p(75, 75).x, p(75, 75).y, p(125, 75).x, p(125, 75).y);
        ctx.bezierCurveTo(p(145, 75).x, p(145, 75).y, p(165, 85).x, p(165, 85).y, p(178, 85).x, p(178, 85).y);
        ctx.lineTo(p(183, 62).x, p(183, 62).y);
        ctx.lineTo(p(196, 78).x, p(196, 78).y);
        ctx.bezierCurveTo(p(202, 77).x, p(202, 77).y, p(208, 77).x, p(208, 77).y, p(214, 78).x, p(214, 78).y);
        ctx.lineTo(p(223, 60).x, p(223, 60).y);
        ctx.lineTo(p(231, 82).x, p(231, 82).y);
        ctx.bezierCurveTo(p(245, 87).x, p(245, 87).y, p(260, 105).x, p(260, 105).y, p(260, 125).x, p(260, 125).y);
        ctx.bezierCurveTo(p(260, 148).x, p(260, 148).y, p(150, 148).x, p(150, 148).y, m.x, m.y);
        ctx.fill();
        ctx.beginPath();
        var t0 = p(65, 145);
        ctx.moveTo(t0.x, t0.y);
        ctx.bezierCurveTo(p(45, 145).x, p(45, 145).y, p(45, 128).x, p(45, 128).y, p(58, 122).x, p(58, 122).y);
        ctx.bezierCurveTo(p(66, 118).x, p(66, 118).y, p(72, 128).x, p(72, 128).y, p(68, 137).x, p(68, 137).y);
        ctx.bezierCurveTo(p(66, 141).x, p(66, 141).y, p(72, 145).x, p(72, 145).y, p(82, 145).x, p(82, 145).y);
        ctx.lineTo(t0.x, t0.y);
        ctx.fill();
    }

    function draw(now) {
        S.resizeCanvas(canvas);
        var w = canvas._cssW;
        var h = canvas._cssH;
        var ctx = canvas.getContext('2d');
        var t = now / 1000;
        var phase = S.reducedMotion ? 0 : Math.sin((t / 4) * Math.PI * 2);
        var scaleX = 1 + 0.007 * phase;
        var scaleY = 1 - 0.007 * phase;
        var bob = -2.5 * phase;
        var scene = sceneRect(w, h);

        ctx.fillStyle = '#F2F2F7';
        ctx.fillRect(0, 0, w, h);

        var sunX = w * (105 / 390);
        var sunY = h * (150 / 844);
        var dim = Math.min(w / 390, h / 844);
        var coreR = 27.5 * dim;
        var halo1 = 55 * dim;
        var halo2 = 42.5 * dim;
        ctx.fillStyle = 'rgba(253,186,116,0.08)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, halo1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(253,186,116,0.15)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, halo2, 0, Math.PI * 2);
        ctx.fill();
        var core = ctx.createLinearGradient(sunX - coreR, sunY - coreR, sunX + coreR, sunY + coreR);
        core.addColorStop(0, '#FF9A9E');
        core.addColorStop(1, '#FECFEF');
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(sunX, sunY, coreR, 0, Math.PI * 2);
        ctx.fill();

        var origin = { x: scene.x + scene.w * 0.5, y: scene.y + scene.h * (170 / 240) };
        drawCloud(ctx, scene);

        ctx.save();
        ctx.translate(origin.x, origin.y + bob);
        ctx.scale(scaleX, scaleY);
        ctx.translate(-origin.x, -origin.y);
        drawCat(ctx, scene);

        var zCycle = (t % 4) / 4;
        if (zCycle < 0.9) {
            var z = unit(scene, 108, 68);
            var letters = ['Z', 'z', 'z'];
            for (var zi = 0; zi < 3; zi++) {
                var delay = zi * 0.2;
                var lp = Math.max(0, Math.min(1, (zCycle - delay) / 0.55));
                if (lp <= 0) continue;
                ctx.globalAlpha = Math.sin(lp * Math.PI) * 0.7;
                ctx.fillStyle = '#1C1C1E';
                ctx.font = '700 ' + (18 - zi * 3) * (scene.h / 240) + 'px ui-monospace, Menlo, monospace';
                ctx.fillText(letters[zi], z.x - lp * 18 - zi * 8, z.y - lp * 28 - zi * 12);
                ctx.globalAlpha = 1;
            }
        }
        ctx.restore();
    }

    function frame(now) {
        draw(now);
        if (!S.reducedMotion) requestAnimationFrame(frame);
    }

    S.resizeCanvas(canvas);
    if (S.reducedMotion) {
        draw(performance.now());
        window.addEventListener('resize', function () { draw(performance.now()); });
    } else {
        requestAnimationFrame(frame);
    }
})();
