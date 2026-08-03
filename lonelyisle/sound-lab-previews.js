(function () {
    'use strict';

    function resizeCanvas(canvas) {
        var stage = canvas.parentElement;
        if (!stage) return;
        var rect = stage.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = Math.max(1, Math.round(rect.width));
        var h = Math.max(1, Math.round(rect.height));
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        var ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        canvas._cssW = w;
        canvas._cssH = h;
    }

    function roundRect(ctx, x, y, w, h, r) {
        var rr = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + w, y, x + w, y + h, rr);
        ctx.arcTo(x + w, y + h, x, y + h, rr);
        ctx.arcTo(x, y + h, x, y, rr);
        ctx.arcTo(x, y, x + w, y, rr);
        ctx.closePath();
    }

    /* Map CloudSlumber 360×240 unit point into scene rect */
    function unit(rect, x, y) {
        return {
            x: rect.x + (x / 360) * rect.w,
            y: rect.y + (y / 240) * rect.h
        };
    }

    function sceneFit(w, h) {
        var aspect = 360 / 240;
        var sh = h * 0.92;
        var sw = sh * aspect;
        if (sw > w * 0.96) {
            sw = w * 0.96;
            sh = sw / aspect;
        }
        return {
            x: (w - sw) * 0.5,
            y: (h - sh) * 0.55,
            w: sw,
            h: sh
        };
    }

    /* ——— Floating Sound Bath (side-view koala, App path) ——— */
    function drawKoalaHead(ctx, scale, ox, oy) {
        var fur = '#C7D1D9';
        var furDark = '#B2BABF';
        var pink = '#F5C7C7';
        var mask = '#66527A';

        ctx.save();
        ctx.translate(ox, oy);

        /* Two ears stacked on the LEFT — side profile facing +X */
        var earYs = [-18, 18];
        for (var i = 0; i < earYs.length; i++) {
            var ey = earYs[i];
            ctx.fillStyle = furDark;
            ctx.beginPath();
            ctx.ellipse((-12) * scale, ey * scale, 12 * scale, 12 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = pink;
            ctx.beginPath();
            ctx.ellipse((-12) * scale, ey * scale, 7 * scale, 7 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = fur;
        ctx.beginPath();
        ctx.ellipse(0, 0, 22 * scale, 22 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        /* Sleep mask — left half of face */
        ctx.fillStyle = mask;
        roundRect(ctx, -11 * scale, -18 * scale, 11 * scale, 36 * scale, 5 * scale);
        ctx.fill();

        ctx.strokeStyle = mask;
        ctx.lineWidth = 1.5 * scale;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-5 * scale, -18 * scale);
        ctx.lineTo(-12 * scale, -20 * scale);
        ctx.moveTo(-5 * scale, 18 * scale);
        ctx.lineTo(-12 * scale, 20 * scale);
        ctx.stroke();

        /* Nose — toward the right (facing direction) */
        ctx.fillStyle = '#383838';
        roundRect(ctx, 0, -6 * scale, 11 * scale, 12 * scale, 5.5 * scale);
        ctx.fill();

        /* Skin arcs beside mask */
        ctx.strokeStyle = '#F0B899';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(-5 * scale, -9 * scale, 3 * scale, Math.PI / 2, -Math.PI / 2, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-5 * scale, 9 * scale, 3 * scale, Math.PI / 2, -Math.PI / 2, false);
        ctx.stroke();

        /* Blush */
        ctx.fillStyle = 'rgba(255,0,0,0.28)';
        ctx.beginPath();
        ctx.ellipse(2 * scale + 3.5 * scale, -12 * scale, 3.5 * scale, 3.5 * scale, 0, 0, Math.PI * 2);
        ctx.ellipse(2 * scale + 3.5 * scale, 12 * scale, 3.5 * scale, 3.5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawBath(canvas) {
        var w = canvas._cssW;
        var h = canvas._cssH;
        var ctx = canvas.getContext('2d');

        var g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, '#73C7EB');
        g.addColorStop(0.55, '#52B2E0');
        g.addColorStop(1, '#61BDE6');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 1.25;
        for (var i = 0; i < 4; i++) {
            var yBase = h * (0.16 + i * 0.18);
            var amp = 3.5 + i;
            ctx.beginPath();
            for (var x = 0; x <= w; x += 6) {
                var y = yBase + Math.sin(x * 0.018 + i * 0.9) * amp;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        /* Mattress size ≈ phone shortSide ratios, fitted to stage */
        var shortSide = Math.min(w, h);
        var mw = shortSide * 0.55;
        var mh = shortSide * 0.205;
        var cx = w * 0.5;
        var cy = h * 0.52;
        var corner = mh * 0.3;

        /* Soft shadow (top-left cast) */
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        roundRect(ctx, cx - mw / 2 - mw * 0.07, cy - mh / 2 - mh * 0.22, mw, mh, corner);
        ctx.fill();

        ctx.fillStyle = '#242429';
        ctx.strokeStyle = '#0D0D0F';
        ctx.lineWidth = Math.max(2.6 * (mw / 96), 2);
        roundRect(ctx, cx - mw / 2, cy - mh / 2, mw, mh, corner);
        ctx.fill();
        ctx.stroke();

        /* Mattress edge stripes left of blanket */
        var blanket = {
            x: cx - mw / 2 + mw * 0.28,
            y: cy - mh / 2 + 2,
            w: mw * 0.68,
            h: mh - 4
        };
        ctx.strokeStyle = '#3D3D45';
        ctx.lineWidth = Math.max(2.4 * (mw / 96), 2);
        var stripeX = cx - mw / 2 + mw * 0.14;
        while (stripeX < blanket.x - 2) {
            ctx.beginPath();
            ctx.moveTo(stripeX, cy - mh / 2 + 5);
            ctx.lineTo(stripeX, cy + mh / 2 - 5);
            ctx.stroke();
            stripeX += mw * 0.15;
        }

        /* Blanket */
        ctx.fillStyle = '#525459';
        roundRect(ctx, blanket.x, blanket.y, blanket.w, blanket.h, mh * 0.22);
        ctx.fill();
        ctx.save();
        roundRect(ctx, blanket.x, blanket.y, blanket.w, blanket.h, mh * 0.22);
        ctx.clip();
        ctx.strokeStyle = '#383A42';
        ctx.lineWidth = Math.max(2.4 * (mw / 96), 2);
        var bagStripeX = blanket.x + blanket.w * 0.18;
        while (bagStripeX < blanket.x + blanket.w - 4) {
            ctx.beginPath();
            ctx.moveTo(bagStripeX, blanket.y + 4);
            ctx.lineTo(bagStripeX, blanket.y + blanket.h - 4);
            ctx.stroke();
            bagStripeX += Math.max(blanket.w * 0.14, 10);
        }
        ctx.restore();

        var headScale = mh / 66;
        var headOffsetX = -mw * 0.32;
        drawKoalaHead(ctx, headScale, cx + headOffsetX, cy);
    }

    /* ——— Piano Sea (App bell path) ——— */
    function drawJelly(ctx, x, y, scale, hue) {
        var rX = 30 * scale;
        var rY = 22 * scale;
        var glowR = rX * 1.5;
        var glow = ctx.createRadialGradient(x, y, 1, x, y, glowR);
        glow.addColorStop(0, 'hsla(' + hue + ',90%,92%,0.48)');
        glow.addColorStop(0.5, 'hsla(' + hue + ',90%,92%,0.12)');
        glow.addColorStop(1, 'hsla(' + hue + ',90%,92%,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fill();

        /* 3 silk tentacles */
        var baseW = Math.max(0.55, 0.9 * scale);
        var silk = 'hsla(' + hue + ',80%,88%,1)';
        for (var t = 0; t < 3; t++) {
            var offset = (t / 2 - 0.5) * rX * 0.8;
            var nodes = [];
            var nCount = 6;
            for (var n = 0; n < nCount; n++) {
                var ty = y + rY * 0.15 + n * (rY * 0.55);
                var tx = x + offset + Math.sin(n * 0.7 + t) * (2 + n * 0.8) * scale;
                nodes.push({ x: tx, y: ty });
            }
            for (var i = 1; i < nodes.length; i++) {
                var segT = i / (nodes.length - 1);
                var alpha = 0.36 * (1 - segT * segT);
                ctx.strokeStyle = silk.replace(',1)', ',' + alpha + ')');
                ctx.lineWidth = baseW * (1 - segT * 0.55);
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(nodes[i - 1].x, nodes[i - 1].y);
                ctx.lineTo(nodes[i].x, nodes[i].y);
                ctx.stroke();
            }
        }

        /* Bell — exact App curves */
        ctx.beginPath();
        ctx.moveTo(x - rX, y + rY * 0.1);
        ctx.bezierCurveTo(x - rX, y - rY, x + rX, y - rY, x + rX, y + rY * 0.1);
        ctx.bezierCurveTo(x + rX * 0.6, y + rY * 0.4, x - rX * 0.6, y + rY * 0.4, x - rX, y + rY * 0.1);
        ctx.closePath();
        ctx.fillStyle = 'hsla(' + hue + ',85%,82%,0.68)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.78)';
        ctx.lineWidth = Math.max(0.4, 0.55 * scale);
        ctx.stroke();
    }

    function drawPiano(canvas) {
        var w = canvas._cssW;
        var h = canvas._cssH;
        var ctx = canvas.getContext('2d');
        var keyH = h * 0.22;
        var pianoY = h - keyH;

        ctx.fillStyle = '#020205';
        ctx.fillRect(0, 0, w, h);

        var aura = ctx.createLinearGradient(0, pianoY - h * 0.5, 0, pianoY);
        aura.addColorStop(0, 'rgba(40,140,255,0)');
        aura.addColorStop(1, 'rgba(80,190,255,0.22)');
        ctx.fillStyle = aura;
        ctx.fillRect(0, pianoY - h * 0.5, w, h * 0.5);

        /* App phone: baseScale ≈ 0.17–0.24, rX = 30 * scale (~6–7pt on ~844h).
           Thumbnail: keep the same height ratio, with a light readability floor. */
        var scale = 0.20 * (h / 280);
        scale = Math.max(0.22, Math.min(scale, 0.38));
        drawJelly(ctx, w * 0.32, h * 0.36, scale, 198);
        drawJelly(ctx, w * 0.58, h * 0.24, scale * 0.82, 225);
        drawJelly(ctx, w * 0.74, h * 0.44, scale * 0.92, 210);

        var keyW = w / 15;
        for (var i = 0; i < 15; i++) {
            var lit = i === 6 || i === 10;
            ctx.fillStyle = lit ? '#B8E8FF' : '#F8F8FF';
            ctx.fillRect(i * keyW + 0.5, pianoY, keyW - 1, keyH);
            if (lit) {
                ctx.strokeStyle = 'rgba(255,220,100,0.65)';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(i * keyW + 1, pianoY + 1, keyW - 2, keyH - 2);
            }
            /* Seam between white keys */
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect((i + 1) * keyW - 1, pianoY, 1, keyH);
        }

        /* App PianoSeaKeyboard: black keys anchored to white index at x = white.x + white.w * 0.72
           White midis F3–A5; anchors [0,1,2,2,3,4,6,7,8,8,9,10,12,13,14] */
        var blackAnchors = [0, 1, 2, 2, 3, 4, 6, 7, 8, 8, 9, 10, 12, 13, 14];
        var bw = keyW * 0.56;
        var bh = keyH * 0.6;
        for (var b = 0; b < blackAnchors.length; b++) {
            var anchor = blackAnchors[b];
            var bx = anchor * keyW + keyW * 0.72;
            /* Twin blacks on same anchor (A#/B) sit on the same slot — draw once visually thicker feel via overlap */
            ctx.fillStyle = '#080A12';
            ctx.fillRect(bx, pianoY, bw, bh);
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.fillRect(bx + 1, pianoY, Math.max(bw - 2, 1), 5);
        }
    }

    /* ——— Bubble Pop ——— */
    function strawBodyPath(ctx, width, length, topRadius) {
        var r = Math.min(topRadius, width * 0.5);
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

    function drawIceCube(ctx, cx, cy, size, rotDeg) {
        var corner = size * 0.2;
        var half = size * 0.5;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((rotDeg * Math.PI) / 180);

        /* App radial: soft crystalline volume — center slightly clearer, rim softer */
        var rg = ctx.createRadialGradient(-size * 0.12, -size * 0.14, size * 0.05, 0, 0, size * 0.72);
        rg.addColorStop(0, 'rgba(255,255,255,0.34)');
        rg.addColorStop(0.35, 'rgba(255,255,255,0.18)');
        rg.addColorStop(0.7, 'rgba(255,255,255,0.10)');
        rg.addColorStop(1, 'rgba(255,255,255,0.04)');
        ctx.fillStyle = rg;
        roundRect(ctx, -half, -half, size, size, corner);
        ctx.fill();

        /* Inner glow inset */
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

    function drawBubble(canvas) {
        var w = canvas._cssW;
        var h = canvas._cssH;
        var ctx = canvas.getContext('2d');
        var waterY = h / 3;

        /* 1. Full air / dark backdrop (App draws air full-bleed first) */
        ctx.fillStyle = '#080D1A';
        ctx.fillRect(0, 0, w, h);

        /* Straw geometry */
        var strawW = w * (18 / 390);
        var strawTopX = w * (280 / 390) + strawW * 0.5;
        var strawTopY = h * (-20 / 844);
        var radians = (11.5 * Math.PI) / 180;
        var targetTipY = h - h * (65 / 844);
        var strawLen = Math.min(h * (800 / 844), Math.max(0, (targetTipY - strawTopY) / Math.max(Math.cos(radians), 0.001)));
        var topRadius = strawW * 0.55;
        var tipX = strawTopX - Math.sin(radians) * strawLen;
        var tipY = strawTopY + Math.cos(radians) * strawLen;
        var period = strawW * 1.6;
        var stripeX;

        function paintStrawBody() {
            ctx.save();
            ctx.translate(strawTopX + 3, strawTopY + 3);
            ctx.rotate(radians);
            ctx.translate(-strawW / 2, 0);
            ctx.fillStyle = 'rgba(0,0,0,0.22)';
            strawBodyPath(ctx, strawW, strawLen, topRadius);
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.translate(strawTopX, strawTopY);
            ctx.rotate(radians);
            ctx.translate(-strawW / 2, 0);
            strawBodyPath(ctx, strawW, strawLen, topRadius);
            ctx.clip();
            stripeX = -period;
            while (stripeX < strawW + period) {
                ctx.fillStyle = '#FF4D4D';
                ctx.fillRect(stripeX, 0, period * 0.5, strawLen);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(stripeX + period * 0.5, 0, period * 0.5, strawLen);
                stripeX += period;
            }
            ctx.restore();

            ctx.save();
            ctx.translate(strawTopX, strawTopY);
            ctx.rotate(radians);
            ctx.translate(-strawW / 2, 0);
            ctx.strokeStyle = 'rgba(0,0,0,0.08)';
            ctx.lineWidth = 0.5;
            strawBodyPath(ctx, strawW, strawLen, topRadius);
            ctx.stroke();
            ctx.restore();
        }

        /* 2. Straw under water */
        paintStrawBody();

        /* 3. Semi-transparent water covers submerged straw */
        var wg = ctx.createLinearGradient(0, waterY, 0, h);
        wg.addColorStop(0, 'rgba(0,242,254,0.55)');
        wg.addColorStop(1, 'rgba(79,79,229,0.78)');
        ctx.fillStyle = wg;
        ctx.fillRect(0, waterY, w, h - waterY);

        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, waterY);
        ctx.lineTo(w, waterY);
        ctx.stroke();
        var sg = ctx.createLinearGradient(0, waterY - 6, 0, waterY + 10);
        sg.addColorStop(0, 'rgba(0,242,254,0)');
        sg.addColorStop(0.5, 'rgba(0,242,254,0.2)');
        sg.addColorStop(1, 'rgba(0,242,254,0)');
        ctx.fillStyle = sg;
        ctx.fillRect(0, waterY - 6, w, 16);

        /* 4. Ice above water */
        var ices = [
            { nx: 0.18, ny: 0.76, s: 0.26, rot: 15 },
            { nx: 0.72, ny: 0.58, s: 0.24, rot: -20 },
            { nx: 0.32, ny: 0.50, s: 0.22, rot: 28 },
            { nx: 0.86, ny: 0.80, s: 0.23, rot: -32 }
        ];
        for (var ii = 0; ii < ices.length; ii++) {
            var ice = ices[ii];
            var isize = h * ice.s;
            var ix = ice.nx * w;
            var iy = ice.ny * h;
            if (iy - isize * 0.5 < waterY + 4) {
                iy = waterY + isize * 0.55;
            }
            drawIceCube(ctx, ix, iy, isize, ice.rot);
        }

        /* 5. Bubbles */
        var bubbles = [
            { x: tipX - 3, y: tipY - 22, r: 4.5 },
            { x: tipX + 5, y: tipY - 48, r: 6 },
            { x: tipX - 1, y: tipY - 78, r: 4 },
            { x: tipX + 8, y: waterY + 24, r: 5.5 },
            { x: tipX - 6, y: waterY + 10, r: 3.5 }
        ];
        for (var bi = 0; bi < bubbles.length; bi++) {
            var bub = bubbles[bi];
            if (bub.y < waterY - 2) continue;
            var brg = ctx.createRadialGradient(bub.x - bub.r * 0.3, bub.y - bub.r * 0.3, 0, bub.x, bub.y, bub.r);
            brg.addColorStop(0, 'rgba(255,255,255,0.85)');
            brg.addColorStop(0.45, 'rgba(200,245,255,0.35)');
            brg.addColorStop(1, 'rgba(255,255,255,0.08)');
            ctx.fillStyle = brg;
            ctx.beginPath();
            ctx.arc(bub.x, bub.y, bub.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }

        /* 6. Redraw straw above waterline so air section stays crisp */
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, waterY);
        ctx.clip();
        paintStrawBody();
        ctx.restore();
    }

    /* ——— Cloud Slumber (exact App 360×240 paths) ——— */
    function drawCloudPaths(ctx, scene, fillStyle) {
        var p = function (x, y) { return unit(scene, x, y); };
        var a = p(35, 160);
        var b = p(180, 100);
        var c = p(325, 160);
        var d = p(180, 210);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(p(25, 115).x, p(25, 115).y, p(80, 100).x, p(80, 100).y, b.x, b.y);
        ctx.bezierCurveTo(p(280, 100).x, p(280, 100).y, p(335, 115).x, p(335, 115).y, c.x, c.y);
        ctx.bezierCurveTo(p(315, 200).x, p(315, 200).y, p(270, 210).x, p(270, 210).y, d.x, d.y);
        ctx.bezierCurveTo(p(90, 210).x, p(90, 210).y, p(45, 200).x, p(45, 200).y, a.x, a.y);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }

    function drawCloudShadow(ctx, scene) {
        var p = function (x, y) { return unit(scene, x, y); };
        var a = p(35, 165);
        var b = p(180, 105);
        var c = p(325, 165);
        var d = p(180, 215);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(p(25, 120).x, p(25, 120).y, p(80, 105).x, p(80, 105).y, b.x, b.y);
        ctx.bezierCurveTo(p(280, 105).x, p(280, 105).y, p(335, 120).x, p(335, 120).y, c.x, c.y);
        ctx.bezierCurveTo(p(315, 205).x, p(315, 205).y, p(270, 215).x, p(270, 215).y, d.x, d.y);
        ctx.bezierCurveTo(p(90, 215).x, p(90, 215).y, p(45, 205).x, p(45, 205).y, a.x, a.y);
        ctx.closePath();
        ctx.fillStyle = '#E5E5EA';
        ctx.fill();
    }

    function drawCatBody(ctx, scene) {
        var offX = 20;
        var offY = 15;
        var p = function (x, y) { return unit(scene, x + offX, y + offY); };
        var cat = '#1C1C1E';

        ctx.beginPath();
        var m = p(62, 145);
        ctx.moveTo(m.x, m.y);
        var c1 = p(125, 75);
        ctx.bezierCurveTo(p(52, 115).x, p(52, 115).y, p(75, 75).x, p(75, 75).y, c1.x, c1.y);
        var c2 = p(178, 85);
        ctx.bezierCurveTo(p(145, 75).x, p(145, 75).y, p(165, 85).x, p(165, 85).y, c2.x, c2.y);
        var e1 = p(183, 62);
        ctx.lineTo(e1.x, e1.y);
        var e2 = p(196, 78);
        ctx.lineTo(e2.x, e2.y);
        var e3 = p(214, 78);
        ctx.bezierCurveTo(p(202, 77).x, p(202, 77).y, p(208, 77).x, p(208, 77).y, e3.x, e3.y);
        var e4 = p(223, 60);
        ctx.lineTo(e4.x, e4.y);
        var e5 = p(231, 82);
        ctx.lineTo(e5.x, e5.y);
        var e6 = p(260, 125);
        ctx.bezierCurveTo(p(245, 87).x, p(245, 87).y, p(260, 105).x, p(260, 105).y, e6.x, e6.y);
        ctx.bezierCurveTo(p(260, 148).x, p(260, 148).y, p(150, 148).x, p(150, 148).y, m.x, m.y);
        ctx.closePath();
        ctx.fillStyle = cat;
        ctx.fill();

        /* Tail */
        ctx.beginPath();
        var t0 = p(65, 145);
        ctx.moveTo(t0.x, t0.y);
        var t1 = p(58, 122);
        ctx.bezierCurveTo(p(45, 145).x, p(45, 145).y, p(45, 128).x, p(45, 128).y, t1.x, t1.y);
        var t2 = p(68, 137);
        ctx.bezierCurveTo(p(66, 118).x, p(66, 118).y, p(72, 128).x, p(72, 128).y, t2.x, t2.y);
        var t3 = p(82, 145);
        ctx.bezierCurveTo(p(66, 141).x, p(66, 141).y, p(72, 145).x, p(72, 145).y, t3.x, t3.y);
        ctx.lineTo(t0.x, t0.y);
        ctx.closePath();
        ctx.fill();
    }

    function drawCloud(canvas) {
        var w = canvas._cssW;
        var h = canvas._cssH;
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = '#F2F2F7';
        ctx.fillRect(0, 0, w, h);

        /* Warm sun — proportions from App WarmSunLayout */
        var sunX = w * 0.2;
        var sunY = h * 0.22;
        var coreR = Math.min(w, h) * 0.085;
        var halo1 = coreR * (55 / 27.5);
        var halo2 = coreR * (42.5 / 27.5);

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

        var scene = sceneFit(w, h);
        drawCloudShadow(ctx, scene);
        drawCloudPaths(ctx, scene, '#FFFFFF');
        drawCatBody(ctx, scene);

        /* Static Zzz at App anchor 108,68 in scene */
        var z = unit(scene, 108, 68);
        ctx.fillStyle = 'rgba(28,28,30,0.55)';
        ctx.font = '700 ' + Math.max(11, scene.h * 0.07) + 'px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText('Z', z.x, z.y);
        ctx.font = '700 ' + Math.max(9, scene.h * 0.055) + 'px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText('z', z.x - scene.w * 0.04, z.y - scene.h * 0.08);
        ctx.font = '700 ' + Math.max(7, scene.h * 0.045) + 'px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText('z', z.x - scene.w * 0.07, z.y - scene.h * 0.15);
    }

    var drawers = {
        bath: drawBath,
        piano: drawPiano,
        bubble: drawBubble,
        cloud: drawCloud
    };

    function paintAll() {
        var nodes = document.querySelectorAll('[data-sound-lab-preview]');
        for (var i = 0; i < nodes.length; i++) {
            var canvas = nodes[i];
            var kind = canvas.getAttribute('data-sound-lab-preview');
            if (!drawers[kind]) continue;
            resizeCanvas(canvas);
            drawers[kind](canvas);
        }
    }

    function boot() {
        paintAll();
        var timer = null;
        window.addEventListener('resize', function () {
            clearTimeout(timer);
            timer = setTimeout(paintAll, 100);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
