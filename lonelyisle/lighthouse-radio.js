(function () {
    'use strict';

    var MIDNIGHT = {
        bgTop: [7, 9, 19],
        bgBottom: [15, 18, 36],
        lhColor: [17, 21, 36],
        lhAccent: [26, 32, 54],
        lightCore: [255, 245, 220, 0.95],
        lightGlow: [140, 165, 255, 0.15],
        textOpacity: 0.4
    };

    var MORNING = {
        bgTop: [74, 112, 156],
        bgBottom: [229, 169, 158],
        lhColor: [30, 42, 56],
        lhAccent: [45, 62, 82],
        lightCore: [255, 253, 240, 0.95],
        lightGlow: [255, 240, 180, 0.12],
        textOpacity: 0.8
    };

    var AFTERNOON = {
        bgTop: [51, 105, 132],
        bgBottom: [69, 119, 145],
        lhColor: [17, 31, 44],
        lhAccent: [26, 47, 66],
        lightCore: [255, 255, 255, 0.75],
        lightGlow: [255, 255, 255, 0.05],
        textOpacity: 0.7
    };

    var SUNSET = {
        bgTop: [200, 75, 75],
        bgBottom: [75, 46, 80],
        lhColor: [26, 18, 30],
        lhAccent: [42, 29, 48],
        lightCore: [255, 200, 140, 0.95],
        lightGlow: [255, 150, 90, 0.2],
        textOpacity: 0.7
    };

    var ANCHORS = [
        { minutes: 105, theme: MIDNIGHT },
        { minutes: 450, theme: MORNING },
        { minutes: 840, theme: AFTERNOON },
        { minutes: 1155, theme: SUNSET }
    ];

    var SEGMENTS = [
        {
            id: 'deepNight',
            minutes: 105,
            time: '1:45',
            label: 'Deep Night',
            subtitle: 'Polar winds tracing the sleeping dark.',
            layers: [{ track: 'waves.m4a', volume: 1 }]
        },
        {
            id: 'preDawn',
            minutes: 270,
            time: '4:30',
            label: 'Pre-Dawn',
            subtitle: 'First light breaking through the silver mist.',
            layers: [
                { track: 'polarwind.m4a', volume: 0.55 },
                { track: 'waves.m4a', volume: 0.45 }
            ],
            iconTrack: 'polarwind.m4a'
        },
        {
            id: 'morning',
            minutes: 450,
            time: '7:30',
            label: 'Morning',
            subtitle: 'Inland hush—the day unfolding silently.',
            layers: [{ track: 'countryside.m4a', volume: 1 }]
        },
        {
            id: 'midday',
            minutes: 660,
            time: '11:00',
            label: 'Midday',
            subtitle: 'Shifting tides under a suspended noon.',
            layers: [
                { track: 'countryside.m4a', volume: 0.55 },
                { track: 'seasidesoftwaves.m4a', volume: 0.45 }
            ],
            iconTrack: 'seasidesoftwaves.m4a'
        },
        {
            id: 'afternoon',
            minutes: 840,
            time: '2:00 PM',
            label: 'Afternoon',
            subtitle: 'White noise fading into a sun-drenched shore.',
            layers: [{ track: 'seasidesoftwaves.m4a', volume: 1 }]
        },
        {
            id: 'eveningRain',
            minutes: 1020,
            time: '5:00 PM',
            label: 'Evening Rain',
            subtitle: 'Evening rain writing secrets on the glass.',
            layers: [{ track: 'softrain.m4a', volume: 1 }]
        },
        {
            id: 'dusk',
            minutes: 1155,
            time: '7:15 PM',
            label: 'Dusk',
            subtitle: 'The day recedes, leaving only the horizon.',
            layers: [{ track: 'dusk.m4a', volume: 1 }]
        },
        {
            id: 'hearth',
            minutes: 1380,
            time: '11:00 PM',
            label: 'Hearth',
            subtitle: 'The world is asleep. Let the hearth burn.',
            layers: [{ track: 'fireplace.m4a', volume: 1 }]
        }
    ];

    var TRACK_LABELS = {
        'waves.m4a': 'Ocean waves',
        'polarwind.m4a': 'Polar wind',
        'countryside.m4a': 'Countryside',
        'seasidesoftwaves.m4a': 'Soft seaside waves',
        'softrain.m4a': 'Soft rain',
        'dusk.m4a': 'Dusk ambience',
        'fireplace.m4a': 'Fireplace'
    };

    var TRACK_ICON_PATHS = {
        'waves.m4a':
            '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 2.3 0 2.8 1 3.8 1.5"/>' +
            '<path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 2.3 0 2.8 1 3.8 1.5"/>' +
            '<path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 2.3 0 2.8 1 3.8 1.5"/>',
        'polarwind.m4a':
            '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>' +
            '<path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>' +
            '<path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
        'countryside.m4a':
            '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
        'seasidesoftwaves.m4a':
            '<path d="M2 10c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 2.3 0 2.8 1 3.8 1.5"/>' +
            '<path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 2.3 0 2.8 1 3.8 1.5"/>',
        'softrain.m4a':
            '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>' +
            '<path d="M16 14v6"/>' +
            '<path d="M8 14v6"/>' +
            '<path d="M12 16v6"/>',
        'dusk.m4a':
            '<path d="M12 10V2"/>' +
            '<path d="m4.93 10.93 1.41 1.41"/>' +
            '<path d="M2 18h2"/>' +
            '<path d="M20 18h2"/>' +
            '<path d="m19.07 10.93-1.41 1.41"/>' +
            '<path d="M22 22H2"/>' +
            '<path d="m8 6 4-4 4 4"/>' +
            '<path d="M16 18a4 4 0 0 0-8 0"/>',
        'fireplace.m4a':
            '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'
    };

    function trackIconSvg(track) {
        var paths = TRACK_ICON_PATHS[track];
        if (!paths) return '';
        return (
            '<svg class="radio-timeline__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' +
            'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
            'aria-hidden="true">' + paths + '</svg>'
        );
    }

    function representativeTrack(segment) {
        if (segment.iconTrack) return segment.iconTrack;
        return segment.layers.length ? segment.layers[0].track : null;
    }

    function layerLabels(segment) {
        return segment.layers.map(function (layer) {
            return TRACK_LABELS[layer.track] || layer.track;
        }).join(', ');
    }

    function renderTimelineSoundIcons(buttons) {
        buttons.forEach(function (btn) {
            var segment = findSegment(btn.getAttribute('data-segment'));
            var timeEl = btn.querySelector('.radio-timeline__time');
            if (!timeEl || btn.querySelector('.radio-timeline__sounds')) return;

            var sounds = document.createElement('span');
            sounds.className = 'radio-timeline__sounds';
            sounds.setAttribute('aria-hidden', 'true');

            var track = representativeTrack(segment);
            if (!track) return;

            var wrap = document.createElement('span');
            wrap.className = 'radio-timeline__icon-wrap';
            wrap.innerHTML = trackIconSvg(track);
            wrap.setAttribute('title', TRACK_LABELS[track] || track);
            sounds.appendChild(wrap);

            btn.insertBefore(sounds, timeEl);
            btn.setAttribute(
                'aria-label',
                segment.label + ', ' + segment.time + ' — ' + layerLabels(segment)
            );
        });
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function lerpTheme(from, to, progress) {
        var t = Math.min(1, Math.max(0, progress));
        return {
            bgTop: [
                lerp(from.bgTop[0], to.bgTop[0], t),
                lerp(from.bgTop[1], to.bgTop[1], t),
                lerp(from.bgTop[2], to.bgTop[2], t)
            ],
            bgBottom: [
                lerp(from.bgBottom[0], to.bgBottom[0], t),
                lerp(from.bgBottom[1], to.bgBottom[1], t),
                lerp(from.bgBottom[2], to.bgBottom[2], t)
            ],
            lhColor: [
                lerp(from.lhColor[0], to.lhColor[0], t),
                lerp(from.lhColor[1], to.lhColor[1], t),
                lerp(from.lhColor[2], to.lhColor[2], t)
            ],
            lhAccent: [
                lerp(from.lhAccent[0], to.lhAccent[0], t),
                lerp(from.lhAccent[1], to.lhAccent[1], t),
                lerp(from.lhAccent[2], to.lhAccent[2], t)
            ],
            lightCore: [
                lerp(from.lightCore[0], to.lightCore[0], t),
                lerp(from.lightCore[1], to.lightCore[1], t),
                lerp(from.lightCore[2], to.lightCore[2], t),
                lerp(from.lightCore[3], to.lightCore[3], t)
            ],
            lightGlow: [
                lerp(from.lightGlow[0], to.lightGlow[0], t),
                lerp(from.lightGlow[1], to.lightGlow[1], t),
                lerp(from.lightGlow[2], to.lightGlow[2], t),
                lerp(from.lightGlow[3], to.lightGlow[3], t)
            ],
            textOpacity: lerp(from.textOpacity, to.textOpacity, t)
        };
    }

    function themeForMinutes(minutes) {
        var sorted = ANCHORS;
        var from = sorted[sorted.length - 1].theme;
        var to = sorted[0].theme;
        var fromMinutes = sorted[sorted.length - 1].minutes - 1440;
        var toMinutes = sorted[0].minutes;

        for (var i = 0; i < sorted.length; i++) {
            var current = sorted[i];
            var next = sorted[(i + 1) % sorted.length];
            var nextMinutes = i + 1 < sorted.length ? next.minutes : next.minutes + 1440;

            if (minutes >= current.minutes && minutes < nextMinutes) {
                from = current.theme;
                to = next.theme;
                fromMinutes = current.minutes;
                toMinutes = nextMinutes;
                break;
            }
        }

        var span = Math.max(1, toMinutes - fromMinutes);
        var progress = (minutes - fromMinutes) / span;
        return lerpTheme(from, to, progress);
    }

    function rgb(arr) {
        return 'rgb(' + Math.round(arr[0]) + ', ' + Math.round(arr[1]) + ', ' + Math.round(arr[2]) + ')';
    }

    function rgba(arr) {
        return 'rgba(' + Math.round(arr[0]) + ', ' + Math.round(arr[1]) + ', ' + Math.round(arr[2]) + ', ' + arr[3] + ')';
    }

    function applyTheme(canvas, theme) {
        var glowAlpha = theme.lightGlow[3];
        var coreAlpha = theme.lightCore[3];

        canvas.style.setProperty('--radio-bg-top', rgb(theme.bgTop));
        canvas.style.setProperty('--radio-bg-bottom', rgb(theme.bgBottom));
        canvas.style.setProperty('--lh-color', rgb(theme.lhColor));
        canvas.style.setProperty('--lh-accent', rgb(theme.lhAccent));
        canvas.style.setProperty('--lh-core', rgb(theme.lightCore.slice(0, 3)));
        canvas.style.setProperty('--lh-glow-stop', rgb(theme.lightGlow.slice(0, 3)));
        canvas.style.setProperty('--lh-core-alpha', String(coreAlpha));
        canvas.style.setProperty('--lh-ambient-grad-center', String(glowAlpha * 0.85));
        canvas.style.setProperty('--lh-core-grad-inner', String(coreAlpha * 0.95));
        canvas.style.setProperty('--lh-core-grad-mid', String(coreAlpha * 0.25));
        canvas.style.setProperty('--radio-subtitle-opacity', String(theme.textOpacity));
    }

    var CYCLE_START_MINUTES = 105;
    var CYCLE_DURATION_MS = 60000;
    var SEGMENT_COUNT = SEGMENTS.length;

    function cycleProgressAt(timestamp, cycleStart, pausedAt) {
        var elapsed = (timestamp - cycleStart + pausedAt) % CYCLE_DURATION_MS;
        return elapsed / CYCLE_DURATION_MS;
    }

    function segmentCycleOffset(index) {
        return ((SEGMENTS[index].minutes - CYCLE_START_MINUTES + 1440) % 1440) / 1440;
    }

    function visualTimelineProgress(cycleProg) {
        var lastIndex = SEGMENT_COUNT - 1;

        for (var i = 0; i < SEGMENT_COUNT; i++) {
            var segStart = segmentCycleOffset(i);
            var nextIndex = i + 1 < SEGMENT_COUNT ? i + 1 : 0;
            var segEnd = segmentCycleOffset(nextIndex);
            var dotStart = i / lastIndex;
            var dotEnd = nextIndex === 0 ? 1 : nextIndex / lastIndex;
            var inSegment = false;
            var t = 0;

            if (segEnd > segStart) {
                inSegment = cycleProg >= segStart && cycleProg < segEnd;
                t = (cycleProg - segStart) / (segEnd - segStart);
            } else if (i === lastIndex) {
                inSegment = cycleProg >= segStart;
                t = (cycleProg - segStart) / (1 - segStart);
            }

            if (inSegment) {
                return dotStart + t * (dotEnd - dotStart);
            }
        }

        return 0;
    }

    function segmentIndexForMinutes(minutes) {
        var id = segmentIdForMinutes(minutes);
        for (var i = 0; i < SEGMENTS.length; i++) {
            if (SEGMENTS[i].id === id) return i;
        }
        return 0;
    }

    function segmentIdForMinutes(minutes) {
        var normalized = ((minutes % 1440) + 1440) % 1440;

        if (normalized >= 105 && normalized < 270) return 'deepNight';
        if (normalized >= 270 && normalized < 450) return 'preDawn';
        if (normalized >= 450 && normalized < 660) return 'morning';
        if (normalized >= 660 && normalized < 840) return 'midday';
        if (normalized >= 840 && normalized < 1020) return 'afternoon';
        if (normalized >= 1020 && normalized < 1155) return 'eveningRain';
        if (normalized >= 1155 && normalized < 1380) return 'dusk';
        return 'hearth';
    }

    function findSegment(id) {
        for (var i = 0; i < SEGMENTS.length; i++) {
            if (SEGMENTS[i].id === id) return SEGMENTS[i];
        }
        return SEGMENTS[0];
    }

    function initLighthouseRadio() {
        var canvas = document.getElementById('radio-canvas');
        var timeline = document.getElementById('radio-timeline');
        var stage = document.getElementById('lh-stage');
        var ripples = document.getElementById('lh-ripples');

        if (!canvas || !timeline || !stage) return;

        var subtitles = canvas.querySelectorAll('.radio-header__subtitle');
        var buttons = timeline.querySelectorAll('.radio-timeline__btn');
        var timelineRail = document.getElementById('radio-timeline-rail');
        renderTimelineSoundIcons(buttons);
        var activeId = null;
        var activeSegmentIndex = -1;
        var cycleStart = null;
        var pausedAt = 0;
        var rafId = null;
        var mobileTimelineQuery = window.matchMedia('(max-width: 768px)');
        var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        var lastFollowSegmentIndex = -1;
        var smoothFollowUntil = 0;

        function playheadScrollLeft(visualProgress) {
            if (!timelineRail) return 0;

            var railWidth = timelineRail.offsetWidth;
            if (!railWidth) return 0;

            var playheadX = 14 + (railWidth - 28) * visualProgress;
            var targetScroll = playheadX - timeline.clientWidth * 0.5;
            var maxScroll = Math.max(0, timeline.scrollWidth - timeline.clientWidth);

            return Math.max(0, Math.min(targetScroll, maxScroll));
        }

        function scrollPlayheadIntoView(visualProgress, useSmooth) {
            if (!mobileTimelineQuery.matches) return;

            var targetScroll = playheadScrollLeft(visualProgress);
            var instant = reducedMotionQuery.matches || !useSmooth;

            if (instant) {
                timeline.scrollLeft = targetScroll;
            } else {
                timeline.scrollTo({ left: targetScroll, behavior: 'smooth' });
            }
        }

        function followTimelinePlayhead(visualProgress, segmentIndex) {
            if (!mobileTimelineQuery.matches) return;

            var segmentChanged = segmentIndex !== lastFollowSegmentIndex;
            var now = performance.now();

            if (segmentChanged) {
                lastFollowSegmentIndex = segmentIndex;
                scrollPlayheadIntoView(visualProgress, true);
                smoothFollowUntil = now + 450;
                return;
            }

            if (now < smoothFollowUntil) return;

            scrollPlayheadIntoView(visualProgress, false);
        }

        function setSubtitle(text) {
            subtitles.forEach(function (el) {
                el.classList.toggle('is-active', el.getAttribute('data-subtitle') === text);
            });
        }

        function updateSegmentUI(id, segmentIndex) {
            if (id !== activeId) {
                activeId = id;
                var segment = findSegment(id);
                setSubtitle(segment.subtitle);
                canvas.setAttribute('data-segment', id);
            }

            buttons.forEach(function (btn, index) {
                var isActive = index === segmentIndex;
                var isPast = index < segmentIndex;
                btn.classList.toggle('is-active', isActive);
                btn.classList.toggle('is-past', isPast);
                btn.setAttribute('aria-current', isActive ? 'true' : 'false');
            });

            if (segmentIndex !== activeSegmentIndex) {
                activeSegmentIndex = segmentIndex;
            }
        }

        function updateTimeline(theme, cycleProg, minutes) {
            var visualProgress = visualTimelineProgress(cycleProg);
            var segmentIndex = segmentIndexForMinutes(minutes);

            timeline.style.setProperty('--timeline-progress', visualProgress.toFixed(5));
            timeline.style.setProperty('--timeline-playhead', rgb(theme.lightCore.slice(0, 3)));
            timeline.style.setProperty('--timeline-glow', rgba(theme.lightGlow));

            if (timelineRail) {
                timelineRail.setAttribute('aria-valuenow', String(Math.round(visualProgress * 100)));
            }

            updateSegmentUI(segmentIdForMinutes(minutes), segmentIndex);
            followTimelinePlayhead(visualProgress, segmentIndex);
        }

        function virtualMinutesAt(timestamp) {
            var cycleProg = cycleProgressAt(timestamp, cycleStart, pausedAt);
            return (CYCLE_START_MINUTES + cycleProg * 1440) % 1440;
        }

        function tick(timestamp) {
            if (cycleStart === null) {
                cycleStart = timestamp;
            }

            var cycleProg = cycleProgressAt(timestamp, cycleStart, pausedAt);
            var minutes = virtualMinutesAt(timestamp);
            var theme = themeForMinutes(minutes);

            applyTheme(canvas, theme);
            updateTimeline(theme, cycleProg, minutes);
            rafId = window.requestAnimationFrame(tick);
        }

        function startAutoplay() {
            canvas.classList.add('is-autoplay');
            cycleStart = null;
            pausedAt = 0;
            rafId = window.requestAnimationFrame(tick);
        }

        function stopAutoplay() {
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        function pauseAutoplay() {
            if (rafId === null || cycleStart === null) return;
            pausedAt = (performance.now() - cycleStart + pausedAt) % CYCLE_DURATION_MS;
            stopAutoplay();
        }

        function resumeAutoplay() {
            if (rafId !== null) return;
            cycleStart = performance.now();
            rafId = window.requestAnimationFrame(tick);
        }

        stage.addEventListener('click', triggerEcho);
        stage.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                triggerEcho();
            }
        });

        function triggerEcho() {
            if (!ripples) return;

            var coreDot = document.querySelector('.lh-core-dot');
            var ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ring.setAttribute('class', 'lh-ripple-ring');
            ring.setAttribute('cx', '0');
            ring.setAttribute('cy', '0');
            ring.setAttribute('r', '0');
            ripples.appendChild(ring);

            if (coreDot) {
                coreDot.classList.add('is-flash');
                window.setTimeout(function () {
                    coreDot.classList.remove('is-flash');
                }, 100);
            }

            window.setTimeout(function () {
                if (ring.parentNode) ring.parentNode.removeChild(ring);
            }, 1300);
        }

        function syncMobileTimelineScroll(visualProgress, segmentIndex, useSmooth) {
            if (!mobileTimelineQuery.matches) return;
            lastFollowSegmentIndex = segmentIndex;
            scrollPlayheadIntoView(visualProgress, useSmooth);
            smoothFollowUntil = useSmooth && !reducedMotionQuery.matches
                ? performance.now() + 450
                : 0;
        }

        if (reducedMotionQuery.matches) {
            var theme = themeForMinutes(CYCLE_START_MINUTES);
            applyTheme(canvas, theme);
            updateTimeline(theme, 0, CYCLE_START_MINUTES);
            syncMobileTimelineScroll(0, segmentIndexForMinutes(CYCLE_START_MINUTES), false);
            return;
        }

        syncMobileTimelineScroll(0, segmentIndexForMinutes(CYCLE_START_MINUTES), true);
        startAutoplay();

        mobileTimelineQuery.addEventListener('change', function () {
            if (!mobileTimelineQuery.matches) return;
            var minutes = cycleStart === null ? CYCLE_START_MINUTES : virtualMinutesAt(performance.now());
            var cycleProg = cycleStart === null ? 0 : cycleProgressAt(performance.now(), cycleStart, pausedAt);
            syncMobileTimelineScroll(
                visualTimelineProgress(cycleProg),
                segmentIndexForMinutes(minutes),
                false
            );
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                pauseAutoplay();
            } else {
                resumeAutoplay();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLighthouseRadio);
    } else {
        initLighthouseRadio();
    }
})();
