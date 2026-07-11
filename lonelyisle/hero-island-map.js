(function () {
    'use strict';

    var MAP_SIZE = 4096;
    var ISLAND_BOUNDS = {
        minX: 644,
        minY: 840,
        maxX: 3456,
        maxY: 3450
    };
    var ISLAND_PAD = 150;
    var VISIBLE_PX = Math.max(
        ISLAND_BOUNDS.maxX - ISLAND_BOUNDS.minX,
        ISLAND_BOUNDS.maxY - ISLAND_BOUNDS.minY
    ) + ISLAND_PAD * 2;
    var FOCUS = clampFocus({
        x: (ISLAND_BOUNDS.minX + ISLAND_BOUNDS.maxX) * 0.5,
        y: (ISLAND_BOUNDS.minY + ISLAND_BOUNDS.maxY) * 0.5
    }, VISIBLE_PX);
    var WALK_SPEED = 168;

    var WAYPOINTS = [
        [2286.22, 1752.33],
        [2501.107, 1807.7133],
        [2696.056, 1847.5892],
        [2811.253, 1987.155],
        [2793.531, 2168.812],
        [2658.395, 2295.086],
        [2576.428, 2603.017],
        [2525.476, 2729.291],
        [2283.0046, 2844.49],
        [2053.61, 2873.29],
        [1910.614, 2846.7],
        [1519.716, 2463.451],
        [1333.628, 2155.52],
        [1271.6, 1885.25],
        [1338.059, 1787.7753],
        [1557.376, 1730.1767],
        [1741.249, 1519.7197],
        [1865.307, 1473.197],
        [2042.534, 1519.72]
    ];

    var SPOTS = [
        {
            id: 'puffin',
            x: 2833.18,
            y: 1695.38,
            src: 'images/spots/puffin.png',
            alt: ''
        },
        {
            id: 'lodge',
            x: 1741.25,
            y: 1519.72,
            src: 'images/spots/lodge.png',
            alt: ''
        },
        {
            id: 'cliff',
            x: 1500.45,
            y: 2706.26,
            src: 'images/spots/cliff.png',
            alt: ''
        }
    ];

    var FULL_RADIUS = 240;
    var OUTER_RADIUS = 560;
    var HOLD_MS = 3600;
    var FADE_SPEED = 2.4;

    function PathFollower(waypoints) {
        this.waypoints = waypoints.length >= 2 ? waypoints : [];
        this.segmentIndex = 0;
        this.distanceAlongSegment = 0;
    }

    PathFollower.prototype.isValid = function () {
        return this.waypoints.length >= 2;
    };

    PathFollower.prototype.currentPosition = function () {
        if (!this.waypoints.length) {
            return { x: 0, y: 0 };
        }
        if (this.waypoints.length < 2) {
            return this.waypoints[0];
        }
        return this.positionOnSegment(this.segmentIndex, this.distanceAlongSegment);
    };

    PathFollower.prototype.advance = function (delta) {
        if (this.waypoints.length < 2 || delta <= 0) {
            return;
        }

        var remaining = delta;

        while (remaining > 0) {
            var segmentLength = this.segmentLength(this.segmentIndex);
            if (segmentLength <= 0) {
                this.advanceSegment();
                continue;
            }

            var remainingOnSegment = segmentLength - this.distanceAlongSegment;
            if (remaining <= remainingOnSegment) {
                this.distanceAlongSegment += remaining;
                remaining = 0;
            } else {
                remaining -= remainingOnSegment;
                this.advanceSegment();
            }
        }
    };

    PathFollower.prototype.advanceSegment = function () {
        this.distanceAlongSegment = 0;
        this.segmentIndex += 1;
        if (this.segmentIndex >= this.waypoints.length - 1) {
            this.segmentIndex = 0;
        }
    };

    PathFollower.prototype.positionOnSegment = function (index, distance) {
        var start = this.waypoints[index];
        var end = this.waypoints[index + 1];
        var dx = end.x - start.x;
        var dy = end.y - start.y;
        var length = Math.hypot(dx, dy);
        if (length <= 0) {
            return { x: start.x, y: start.y };
        }
        var t = distance / length;
        return {
            x: start.x + dx * t,
            y: start.y + dy * t
        };
    };

    PathFollower.prototype.segmentLength = function (index) {
        var start = this.waypoints[index];
        var end = this.waypoints[index + 1];
        return Math.hypot(end.x - start.x, end.y - start.y);
    };

    function distanceBetween(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function smoothstep(t) {
        var x = Math.max(0, Math.min(1, t));
        return x * x * (3 - 2 * x);
    }

    function spotTargetOpacity(position, spot, state, now) {
        var distance = distanceBetween(position, spot);

        if (distance <= FULL_RADIUS) {
            state.holdUntil = now + HOLD_MS;
            return 1;
        }

        if (now < state.holdUntil) {
            return 1;
        }

        if (distance >= OUTER_RADIUS) {
            return 0;
        }

        var t = (distance - FULL_RADIUS) / (OUTER_RADIUS - FULL_RADIUS);
        return 1 - smoothstep(t);
    }

    function stepOpacity(current, target, deltaSec) {
        if (target >= current) {
            return Math.min(target, current + deltaSec * 3.6);
        }
        return Math.max(target, current - deltaSec * FADE_SPEED);
    }

    function clampFocus(point, visiblePx) {
        var half = visiblePx * 0.5;
        return {
            x: Math.min(Math.max(point.x, half), MAP_SIZE - half),
            y: Math.min(Math.max(point.y, half), MAP_SIZE - half)
        };
    }

    function applyViewportTransform(viewport, world) {
        var size = viewport.clientWidth;
        if (!size) {
            return 0;
        }

        var scale = size / VISIBLE_PX;
        var tx = size * 0.5 - FOCUS.x * scale;
        var ty = size * 0.5 - FOCUS.y * scale;
        world.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
        return scale;
    }

    function setPosition(el, x, y) {
        el.style.left = x + 'px';
        el.style.top = y + 'px';
    }

    function updateSpots(spotEls, position, now, deltaSec) {
        spotEls.forEach(function (entry) {
            var target = spotTargetOpacity(position, entry.spot, entry.state, now);
            entry.state.displayOpacity = stepOpacity(entry.state.displayOpacity, target, deltaSec);
            var strength = entry.state.displayOpacity;
            entry.el.style.opacity = String(strength);
            entry.el.style.transform = 'scale(' + (0.88 + strength * 0.12) + ')';
        });
    }

    function initHeroIslandMap(root) {
        var viewport = root.querySelector('.hero-island-map__viewport');
        var world = root.querySelector('.hero-island-map__world');
        var avatar = root.querySelector('.hero-island-map__avatar');
        if (!viewport || !world || !avatar) {
            return;
        }

        var waypoints = WAYPOINTS.map(function (pair) {
            return { x: pair[0], y: pair[1] };
        });
        var follower = new PathFollower(waypoints);
        var spotEls = SPOTS.map(function (spot) {
            var el = root.querySelector('[data-spot="' + spot.id + '"]');
            return {
                spot: spot,
                el: el,
                state: { holdUntil: 0, displayOpacity: 0 }
            };
        }).filter(function (entry) {
            return Boolean(entry.el);
        });

        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var paused = document.hidden;
        var lastTs = 0;
        var rafId = 0;

        function layout() {
            applyViewportTransform(viewport, world);
        }

        function frame(ts) {
            rafId = window.requestAnimationFrame(frame);
            if (paused || reducedMotion) {
                lastTs = ts;
                return;
            }

            if (!lastTs) {
                lastTs = ts;
                return;
            }

            var deltaSec = Math.min(0.05, (ts - lastTs) / 1000);
            lastTs = ts;
            follower.advance(WALK_SPEED * deltaSec);

            var position = follower.currentPosition();
            setPosition(avatar, position.x, position.y);
            updateSpots(spotEls, position, ts, deltaSec);
        }

        function onVisibilityChange() {
            paused = document.hidden;
            if (!paused) {
                lastTs = 0;
            }
        }

        layout();

        var position = follower.currentPosition();
        setPosition(avatar, position.x, position.y);
        updateSpots(spotEls, position, performance.now(), 0);

        if (!reducedMotion) {
            rafId = window.requestAnimationFrame(frame);
        } else {
            spotEls.forEach(function (entry) {
                var strength = spotTargetOpacity(position, entry.spot, entry.state, performance.now());
                entry.state.displayOpacity = strength;
                entry.el.style.opacity = String(Math.max(strength, 0.35));
            });
        }

        window.addEventListener('resize', layout);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return function destroy() {
            window.cancelAnimationFrame(rafId);
            window.removeEventListener('resize', layout);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }

    function boot() {
        var roots = document.querySelectorAll('[data-hero-island-map]');
        roots.forEach(initHeroIslandMap);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
