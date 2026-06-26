/* PurrrrrFocus home demos — shared across locales */
function homeT(key, fallback) {
    var i18n = window.HOME_I18N || {};
    return Object.prototype.hasOwnProperty.call(i18n, key) ? i18n[key] : fallback;
}

(function () {
    var brandLink = document.getElementById('header-brand-link');
    if (brandLink) {
        brandLink.addEventListener('click', function (e) {
            if (window.location.hash === '#top' || window.scrollY < 80) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
})();
(function () {
    var dropdown = document.querySelector('.lang-dropdown');
    var trigger = document.querySelector('.lang-dropdown-trigger');
    if (!dropdown || !trigger) return;
    trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = dropdown.classList.toggle('open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            var mobileNav = document.querySelector('.mobile-nav');
            var mobileToggle = document.querySelector('.mobile-nav-toggle');
            if (mobileNav) mobileNav.classList.remove('open');
            if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });
    document.addEventListener('click', function () {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.blur();
    });
})();
(function () {
    var mobileNav = document.querySelector('.mobile-nav');
    var mTrigger = document.querySelector('.mobile-nav-toggle');
    if (!mobileNav || !mTrigger) return;
    var mMenu = document.getElementById('mobile-nav-menu');
    mTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = mobileNav.classList.toggle('open');
        mTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            var dropdown = document.querySelector('.lang-dropdown');
            var langTrigger = document.querySelector('.lang-dropdown-trigger');
            if (dropdown) dropdown.classList.remove('open');
            if (langTrigger) langTrigger.setAttribute('aria-expanded', 'false');
        }
    });
    document.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        mTrigger.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
            mTrigger.setAttribute('aria-expanded', 'false');
        }
    });
    if (mMenu) {
        mMenu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                mobileNav.classList.remove('open');
                mTrigger.setAttribute('aria-expanded', 'false');
            });
        });
    }
})();
(function () {
    var header = document.getElementById('draft-header');
    var hero = document.querySelector('.draft-hero');
    var sticky = document.getElementById('sticky-download');
    var stickyClose = document.getElementById('sticky-close');
    var stickyDismissed = false;

    function setStickyBarActive(active) {
        document.body.classList.toggle('has-sticky-download', !!active);
    }

    function onScroll() {
        var y = window.scrollY;
        if (header) {
            header.classList.toggle('scrolled', y > 40 && y < hero.offsetHeight - 80);
            header.classList.toggle('scrolled-light', y >= hero.offsetHeight - 80);
        }
        if (sticky && !stickyDismissed) {
            if (y > 120) {
                sticky.hidden = false;
                sticky.classList.add('visible');
                setStickyBarActive(true);
            } else {
                sticky.classList.remove('visible');
                setStickyBarActive(false);
            }
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (stickyClose) {
        stickyClose.addEventListener('click', function () {
            stickyDismissed = true;
            sticky.classList.remove('visible');
            sticky.hidden = true;
            setStickyBarActive(false);
        });
    }

    var storyItems = document.querySelectorAll('.story-item');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    var grid = entry.target.querySelector('[data-companion-grid]');
                    if (grid) grid.classList.add('is-active');
                    var reward = entry.target.querySelector('[data-reward-scene]');
                    if (reward) initRewardScene(reward);
                    var badgeReel = entry.target.querySelector('[data-badge-reel]');
                    if (badgeReel) initBadgeReel(badgeReel);
                    var soundsShowcase = entry.target.querySelector('[data-sounds-showcase]');
                    if (soundsShowcase) window.initSoundsShowcase(soundsShowcase);
                    var shieldDemo = entry.target.querySelector('[data-shield-demo]');
                    if (shieldDemo) window.initShieldDemo(shieldDemo);
                    var timerDemo = entry.target.querySelector('[data-timer-demo]');
                    if (timerDemo) window.initTimerDemo(timerDemo);
                    var liveDemo = entry.target.querySelector('[data-live-demo]');
                    if (liveDemo) window.initLiveDemo(liveDemo);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        storyItems.forEach(function (el, i) {
            el.style.transitionDelay = (i * 0.05) + 's';
            io.observe(el);
        });
        var trustSection = document.querySelector('.trust-section');
        if (trustSection) io.observe(trustSection);
    } else {
        storyItems.forEach(function (el) { el.classList.add('revealed'); });
        var trustFallback = document.querySelector('.trust-section');
        if (trustFallback) trustFallback.classList.add('revealed');
    }
})();

(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function runRewardCountUp(scene) {
        scene.querySelectorAll('[data-reward-value]').forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10) || 0;
            var prefix = el.getAttribute('data-prefix') || '+';
            var duration = 1200;
            var startTime = null;

            function step(now) {
                if (!startTime) startTime = now;
                var progress = Math.min(1, (now - startTime) / duration);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = prefix + Math.round(target * eased);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = prefix + target;
                }
            }

            if (reduceMotion) {
                el.textContent = prefix + target;
                return;
            }
            requestAnimationFrame(step);
        });
    }

    window.initRewardScene = function (scene) {
        if (!scene || scene.dataset.rewardReady === 'true') return;
        scene.dataset.rewardReady = 'true';
        scene.classList.add('is-active');

        var fireworksEl = scene.querySelector('[data-reward-fireworks]');
        function startFireworks() {
            if (!fireworksEl || reduceMotion || !window.lottie) return;
            var anim = lottie.loadAnimation({
                container: fireworksEl,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'marketing/firework.json'
            });
            anim.addEventListener('loopComplete', function () {
                runRewardCountUp(scene);
            });
        }

        if (window.lottie) {
            startFireworks();
        } else {
            window.addEventListener('load', startFireworks, { once: true });
        }

        runRewardCountUp(scene);
    };

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-reward-scene]').forEach(function (scene) {
            initRewardScene(scene);
        });
    }
})();

(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var BADGE_ROWS = [
        ['handshake-cat', 'trust-cat', 'partner-cat', 'focus-master-cat', 'concentration-champion-cat', 'time-wizard-cat', 'focus-legend-cat'],
        ['intimate-cat', 'soulmate-cat', 'guardian-companion-cat', 'persistence-companion-cat', 'yearly-companion-cat', 'long-term-companion-cat', 'eternal-companion-cat'],
        ['precious-cat', 'eternal-cat', 'time-collector-cat', 'time-guardian-cat', 'time-treasure-cat', 'time-sage-cat', 'time-accumulation-cat']
    ];
    var MARQUEE_SPEED = 22;

    function badgeArtSrc(name, width) {
        return 'marketing/badges/' + name + '-' + width + 'w.webp';
    }

    function buildBadgeReel(reel) {
        BADGE_ROWS.forEach(function (names, rowIndex) {
            var row = document.createElement('div');
            row.className = 'badge-marquee-row' + (rowIndex % 2 === 1 ? ' badge-marquee-row--right' : ' badge-marquee-row--left');

            var track = document.createElement('div');
            track.className = 'badge-marquee-track';

            for (var copy = 0; copy < 2; copy++) {
                var set = document.createElement('div');
                set.className = 'badge-marquee-set';
                if (copy > 0) set.setAttribute('aria-hidden', 'true');

                names.forEach(function (name, idx) {
                    var cell = document.createElement('div');
                    cell.className = 'badge-cell';
                    cell.style.setProperty('--stagger-tier', String(rowIndex * 8 + idx));

                    var img = document.createElement('img');
                    img.src = badgeArtSrc(name, 120);
                    img.srcset = badgeArtSrc(name, 120) + ' 120w, ' + badgeArtSrc(name, 240) + ' 240w';
                    img.sizes = '(max-width: 860px) 52px, 118px';
                    img.alt = '';
                    img.width = 120;
                    img.height = 120;
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    cell.appendChild(img);
                    set.appendChild(cell);
                });

                track.appendChild(set);
            }

            row.appendChild(track);
            reel.appendChild(row);
        });
    }

    function syncMarqueeDurations(reel) {
        var style = getComputedStyle(reel);
        var padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        var gap = parseFloat(style.getPropertyValue('--badge-gap')) || 14;
        var innerWidth = Math.max(0, reel.clientWidth - padX);
        var cell = Math.max(72, Math.min(118, (innerWidth - gap * 2) / 3.45));
        reel.style.setProperty('--badge-cell-size', cell + 'px');

        reel.querySelectorAll('.badge-marquee-row').forEach(function (row) {
            var track = row.querySelector('.badge-marquee-track');
            var set = track && track.querySelector('.badge-marquee-set');
            if (!set) return;
            var duration = Math.max(20, set.getBoundingClientRect().width / MARQUEE_SPEED);
            track.style.setProperty('--marquee-duration', duration + 's');
        });
    }

    window.initBadgeReel = function (reel) {
        if (!reel || reel.dataset.badgeReady === 'true') return;
        reel.dataset.badgeReady = 'true';
        buildBadgeReel(reel);
        requestAnimationFrame(function () {
            syncMarqueeDurations(reel);
        });

        if (reduceMotion) {
            reel.classList.add('is-active', 'is-static');
            return;
        }

        requestAnimationFrame(function () {
            reel.classList.add('is-active');
        });

        if ('ResizeObserver' in window) {
            var ro = new ResizeObserver(function () {
                syncMarqueeDurations(reel);
            });
            ro.observe(reel);
        }
    };

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-badge-reel]').forEach(function (reel) {
            initBadgeReel(reel);
        });
    }
})();

(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ROTATE_MS = 4500;

    var CHARTS = null;

    function chartConfigs() {
        return [
            {
                id: 'trend',
                title: homeT('demo.stats.trend_title', 'Focus Trend'),
                primaryLabel: homeT('demo.stats.daily_avg', 'Daily avg'),
                secondaryLabel: homeT('demo.stats.this_week', 'This week'),
                primaryValue: '1h 29m',
                secondaryValue: '10h 23m'
            },
            {
                id: 'types',
                title: homeT('demo.stats.types_title', 'Type Distribution'),
                primaryLabel: homeT('demo.stats.top_type', 'Top type'),
                secondaryLabel: homeT('demo.stats.categories', 'Categories'),
                primaryValue: homeT('demo.stats.type_work', 'Work'),
                secondaryValue: homeT('demo.stats.types_count', '6 types')
            },
            {
                id: 'hours',
                title: homeT('demo.stats.hours_title', 'Focus Hours'),
                primaryLabel: homeT('demo.stats.peak_hour', 'Peak hour'),
                secondaryLabel: homeT('demo.stats.deep_focus', 'Deep focus'),
                primaryValue: '5 PM',
                secondaryValue: homeT('demo.stats.sessions_count', '18 sessions')
            }
        ];
    }

    function trendData() {
        return [
            { label: homeT('demo.stats.day_mon', 'Mon'), minutes: 72 },
            { label: homeT('demo.stats.day_tue', 'Tue'), minutes: 95 },
            { label: homeT('demo.stats.day_wed', 'Wed'), minutes: 88 },
            { label: homeT('demo.stats.day_thu', 'Thu'), minutes: 110 },
            { label: homeT('demo.stats.day_fri', 'Fri'), minutes: 102 },
            { label: homeT('demo.stats.day_sat', 'Sat'), minutes: 80 },
            { label: homeT('demo.stats.day_sun', 'Sun'), minutes: 76 }
        ];
    }

    function typeData() {
        return [
            { label: homeT('demo.stats.type_work', 'Work'), seconds: 15600 },
            { label: homeT('demo.stats.type_study', 'Study'), seconds: 13200 },
            { label: homeT('demo.stats.type_writing', 'Writing'), seconds: 8400 },
            { label: homeT('demo.stats.type_meditation', 'Meditation'), seconds: 5400 },
            { label: homeT('demo.stats.type_exercise', 'Exercise'), seconds: 4200 },
            { label: homeT('demo.stats.type_practice', 'Practice'), seconds: 3000 }
        ];
    }

    var HOURLY_DATA = [0,0,0,0,0,600,1400,2200,3200,3600,3000,2500,2100,2300,2500,2900,3400,3600,3100,2200,1400,700,200,0];

    var DONUT_COLORS = [
        '#3B241D', 'rgba(59,36,29,0.82)', 'rgba(59,36,29,0.68)', 'rgba(59,36,29,0.54)',
        'rgba(122,30,30,0.72)', 'rgba(92,58,33,0.62)'
    ];

    function svgDefs(uid) {
        return '<defs>' +
            '<linearGradient id="' + uid + '-bar" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="rgba(59,36,29,0.9)"/>' +
                '<stop offset="100%" stop-color="rgba(59,36,29,0.78)"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + '-bar-sel" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="rgba(122,30,30,0.88)"/>' +
                '<stop offset="100%" stop-color="rgba(122,30,30,0.72)"/>' +
            '</linearGradient>' +
        '</defs>';
    }

    function formatMinutes(m) {
        var h = Math.floor(m / 60);
        var r = m % 60;
        return h > 0 ? h + 'h ' + r + 'm' : r + 'm';
    }

    function formatSeconds(sec) {
        return formatMinutes(Math.round(sec / 60));
    }

    function capsuleBar(x, y, w, h, selected, animate, delay, uid) {
        var rx = w / 2;
        var fill = 'url(#' + uid + (selected ? '-bar-sel' : '-bar') + ')';
        var cls = 'stats-bar' + (animate ? ' stats-bar-animate' : '') + (selected ? ' is-selected' : '');
        return '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + fill + '" style="--bar-delay:' + delay + 's"></rect>';
    }

    function buildShell(container) {
        container.innerHTML =
            '<div class="stats-showcase-frame">' +
                '<div class="stats-showcase-panels"></div>' +
                '<div class="stats-showcase-dots" role="tablist" aria-label="' + homeT('demo.stats.carousel_aria', 'Chart carousel') + '"></div>' +
            '</div>';
        var panelsEl = container.querySelector('.stats-showcase-panels');
        var dotsEl = container.querySelector('.stats-showcase-dots');
        var charts = chartConfigs();

        charts.forEach(function (chart, index) {
            var panel = document.createElement('article');
            panel.className = 'stats-showcase-panel';
            panel.dataset.chartId = chart.id;
            panel.setAttribute('role', 'tabpanel');
            panel.innerHTML =
                '<div class="stats-chart-card">' +
                    '<div class="stats-chart-card-head">' +
                        '<h3 class="stats-showcase-title">' + chart.title + '</h3>' +
                    '</div>' +
                    '<div class="stats-showcase-kpis">' +
                        '<div class="stats-kpi"><span class="stats-kpi-label">' + chart.primaryLabel + '</span><strong class="stats-kpi-value">' + chart.primaryValue + '</strong></div>' +
                        '<div class="stats-kpi"><span class="stats-kpi-label">' + chart.secondaryLabel + '</span><strong class="stats-kpi-value">' + chart.secondaryValue + '</strong></div>' +
                    '</div>' +
                    '<div class="stats-segmented" aria-hidden="true">' +
                        '<span class="stats-segment is-active">' + homeT('demo.stats.segment_duration', 'Duration') + '</span>' +
                        '<span class="stats-segment">' + homeT('demo.stats.segment_sessions', 'Sessions') + '</span>' +
                    '</div>' +
                    '<div class="stats-showcase-chart stats-showcase-chart--' + chart.id + '" data-stats-chart-mount></div>' +
                '</div>';
            panelsEl.appendChild(panel);

            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'stats-showcase-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', chart.title);
            dot.dataset.chartIndex = String(index);
            dotsEl.appendChild(dot);
        });
    }

    function runBarGrow(mount) {
        requestAnimationFrame(function () {
            mount.querySelectorAll('.stats-bar-animate').forEach(function (bar) {
                bar.classList.add('is-grown');
            });
        });
    }

    function renderTrendChart(mount, animate) {
        var TREND_DATA = trendData();
        var uid = 'trend-' + Math.random().toString(36).slice(2, 8);
        var max = Math.max.apply(null, TREND_DATA.map(function (d) { return d.minutes; }));
        var w = 340;
        var h = 188;
        var padX = 20;
        var padTop = 30;
        var padBottom = 26;
        var barW = 28;
        var gap = (w - padX * 2 - barW * TREND_DATA.length) / (TREND_DATA.length - 1);
        var plotH = h - padTop - padBottom;
        var maxBarH = plotH * 0.9;
        var baseY = padTop + plotH;
        var selectedIdx = TREND_DATA.findIndex(function (d) { return d.minutes === max; });

        var barGroups = [];
        var tooltips = [];

        TREND_DATA.forEach(function (d, i) {
            var barH = Math.max(4, (d.minutes / max) * maxBarH);
            var x = padX + i * (barW + gap);
            var y = baseY - barH;
            var delay = animate ? (i * 0.07) : 0;
            var selected = i === selectedIdx;
            var cx = x + barW / 2;

            barGroups.push(
                '<g class="stats-bar-group">' +
                    capsuleBar(x, y, barW, barH, selected, animate, delay, uid) +
                    '<text class="stats-bar-label" x="' + cx + '" y="' + (h - 6) + '" text-anchor="middle">' + d.label + '</text>' +
                '</g>'
            );

            if (selected) {
                var tipY = y - 6;
                tooltips.push(
                    '<g class="stats-tooltip">' +
                        '<rect x="' + (cx - 26) + '" y="' + (tipY - 20) + '" width="52" height="20" rx="7" class="stats-tooltip-bg"></rect>' +
                        '<text x="' + cx + '" y="' + (tipY - 7) + '" text-anchor="middle" class="stats-tooltip-text">' + formatMinutes(d.minutes) + '</text>' +
                    '</g>'
                );
            }
        });

        mount.innerHTML =
            '<svg class="stats-chart-svg stats-chart-trend" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
                svgDefs(uid) + barGroups.join('') + '<g class="stats-tooltips">' + tooltips.join('') + '</g>' +
            '</svg>';
        if (animate) runBarGrow(mount);
    }

    function renderTypesChart(mount, animate) {
        var TYPE_DATA = typeData();
        var uid = 'types-' + Math.random().toString(36).slice(2, 8);
        var total = TYPE_DATA.reduce(function (sum, d) { return sum + d.seconds; }, 0);
        var size = 132;
        var stroke = 26;
        var r = (size - stroke) / 2;
        var cx = size / 2;
        var cy = size / 2;
        var angle = -90;

        var segments = TYPE_DATA.map(function (d, i) {
            var pct = d.seconds / total;
            var sweep = pct * 360;
            var start = angle;
            var end = angle + sweep;
            angle = end;
            var large = sweep > 180 ? 1 : 0;
            var sr = (start * Math.PI) / 180;
            var er = (end * Math.PI) / 180;
            var x1 = cx + r * Math.cos(sr);
            var y1 = cy + r * Math.sin(sr);
            var x2 = cx + r * Math.cos(er);
            var y2 = cy + r * Math.sin(er);
            var path = 'M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2;
            var delay = animate ? (i * 0.07) : 0;
            return '<path class="stats-donut-seg' + (animate ? ' stats-donut-animate' : '') + '" d="' + path + '" stroke="' + DONUT_COLORS[i] + '" stroke-width="' + stroke + '" fill="none" style="--seg-delay:' + delay + 's"></path>';
        }).join('');

        var rows = TYPE_DATA.map(function (d, i) {
            var pct = Math.round((d.seconds / total) * 1000) / 10;
            return '<div class="stats-type-row">' +
                '<span class="stats-type-name">' + d.label + '</span>' +
                '<span class="stats-type-track"><span class="stats-type-fill" style="width:' + pct + '%;background:' + DONUT_COLORS[i] + '"></span></span>' +
                '<span class="stats-type-meta">' + formatSeconds(d.seconds) + ' <em>(' + pct + '%)</em></span>' +
            '</div>';
        }).join('');

        mount.innerHTML =
            '<div class="stats-types-layout">' +
                '<svg class="stats-chart-svg stats-chart-donut" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' + svgDefs(uid) + segments + '</svg>' +
                '<div class="stats-type-bars">' + rows + '</div>' +
            '</div>';

        if (animate) {
            requestAnimationFrame(function () {
                mount.querySelectorAll('.stats-donut-animate').forEach(function (seg) {
                    seg.classList.add('is-drawn');
                });
                mount.querySelectorAll('.stats-type-fill').forEach(function (fill, i) {
                    fill.style.transitionDelay = (0.15 + i * 0.07) + 's';
                    requestAnimationFrame(function () { fill.classList.add('is-filled'); });
                });
            });
        }
    }

    function renderHoursChart(mount, animate) {
        var uid = 'hours-' + Math.random().toString(36).slice(2, 8);
        var max = Math.max.apply(null, HOURLY_DATA);
        var selectedHour = HOURLY_DATA.indexOf(max);
        var w = 520;
        var h = 188;
        var padX = 20;
        var padTop = 28;
        var padBottom = 26;
        var barW = 14;
        var gap = 8;
        var plotH = h - padTop - padBottom;
        var maxBarH = plotH * 0.9;
        var baseY = padTop + plotH;

        var barGroups = [];
        var tooltips = [];

        HOURLY_DATA.forEach(function (sec, i) {
            var barH = sec > 0 ? Math.max(4, (sec / max) * maxBarH) : 4;
            var x = padX + i * (barW + gap);
            var y = baseY - barH;
            var delay = animate ? (i * 0.03) : 0;
            var selected = i === selectedHour;
            var cx = x + barW / 2;
            var label = (i % 4 === 0)
                ? '<text class="stats-bar-label" x="' + cx + '" y="' + (h - 6) + '" text-anchor="middle">' + i + 'h</text>'
                : '';

            barGroups.push(
                '<g class="stats-bar-group">' +
                    capsuleBar(x, y, barW, barH, selected, animate, delay, uid) +
                    label +
                '</g>'
            );

            if (selected) {
                var tipY = y - 6;
                tooltips.push(
                    '<g class="stats-tooltip">' +
                        '<rect x="' + (cx - 22) + '" y="' + (tipY - 18) + '" width="44" height="18" rx="6" class="stats-tooltip-bg"></rect>' +
                        '<text x="' + cx + '" y="' + (tipY - 6) + '" text-anchor="middle" class="stats-tooltip-text">' + formatSeconds(sec) + '</text>' +
                    '</g>'
                );
            }
        });

        mount.innerHTML =
            '<div class="stats-hours-scroll' + (animate && !reduceMotion ? ' is-panning' : '') + '">' +
                '<svg class="stats-chart-svg stats-chart-hours" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
                    svgDefs(uid) + barGroups.join('') + '<g class="stats-tooltips">' + tooltips.join('') + '</g>' +
                '</svg>' +
            '</div>';
        if (animate) runBarGrow(mount);
    }

    var renderers = {
        trend: renderTrendChart,
        types: renderTypesChart,
        hours: renderHoursChart
    };

    function activateChart(container, index, animate) {
        var panels = container.querySelectorAll('.stats-showcase-panel');
        var dots = container.querySelectorAll('.stats-showcase-dot');
        panels.forEach(function (panel, i) {
            panel.classList.toggle('is-active', i === index);
            if (i === index) {
                var mount = panel.querySelector('[data-stats-chart-mount]');
                var id = panel.dataset.chartId;
                if (mount && renderers[id]) renderers[id](mount, animate && !reduceMotion);
            }
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === index);
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
        container.dataset.activeIndex = String(index);
    }

    window.initStatsShowcase = function (container) {
        if (!container || container.dataset.statsReady === 'true') return;
        container.dataset.statsReady = 'true';
        buildShell(container);

        var current = 0;
        var timer = null;

        function goTo(index, animate) {
            current = (index + chartConfigs().length) % chartConfigs().length;
            activateChart(container, current, animate);
        }

        function startRotation() {
            if (reduceMotion || timer) return;
            timer = setInterval(function () {
                goTo(current + 1, true);
            }, ROTATE_MS);
        }

        function stopRotation() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        container.querySelectorAll('.stats-showcase-dot').forEach(function (dot) {
            dot.addEventListener('click', function () {
                stopRotation();
                goTo(parseInt(dot.dataset.chartIndex, 10) || 0, true);
                startRotation();
            });
        });

        container.addEventListener('mouseenter', stopRotation);
        container.addEventListener('mouseleave', startRotation);

        container.classList.add('is-active');
        goTo(0, true);
        startRotation();
    };

    function bootStatsShowcases() {
        document.querySelectorAll('[data-stats-showcase]').forEach(function (el) {
            initStatsShowcase(el);
        });
    }

    if ('IntersectionObserver' in window) {
        var statsIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    initStatsShowcase(entry.target);
                    statsIO.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
        document.querySelectorAll('[data-stats-showcase]').forEach(function (el) {
            statsIO.observe(el);
        });
        requestAnimationFrame(bootStatsShowcases);
    } else {
        bootStatsShowcases();
    }
})();

(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ROTATE_MS = 3200;
    var SLIDE_MS = 560;
    var SOUNDS = [
        { nameKey: 'demo.sounds.summer_night', fallback: 'Summer Night', art: 'marketing/sounds/music_summer_night_preview' },
        { nameKey: 'demo.sounds.birds_singing', fallback: 'Birds Singing', art: 'marketing/sounds/music_birds_singing_preview' },
        { nameKey: 'demo.sounds.ripple', fallback: 'Ripple', art: 'marketing/sounds/music_piano_full_ripple_preview' },
        { nameKey: 'demo.sounds.quiet_night', fallback: 'Quiet Night', art: 'marketing/sounds/music_piano_quiet_night_preview' },
        { nameKey: 'demo.sounds.koto', fallback: 'Koto', art: 'marketing/sounds/music_the_koto_preview' },
        { nameKey: 'demo.sounds.hidden_temple', fallback: 'Hidden Temple', art: 'marketing/sounds/music_hidden_temple_preview' },
        { nameKey: 'demo.sounds.waves', fallback: 'Waves', art: 'marketing/sounds/music_beach_waves_preview' },
        { nameKey: 'demo.sounds.campfire', fallback: 'Campfire', art: 'marketing/sounds/music_campfire_preview' },
        { nameKey: 'demo.sounds.purring_cat', fallback: 'Cat Purr', art: 'marketing/sounds/music_purring_happy_cat_preview' }
    ];

    function setSoundArt(img, artBase) {
        img.src = artBase + '-96w.webp';
        img.srcset = artBase + '-96w.webp 96w, ' + artBase + '-210w.webp 210w';
        img.sizes = '(max-width: 860px) 40vw, 210px';
        img.width = 210;
        img.height = 210;
    }

    function soundName(sound) {
        return homeT(sound.nameKey, sound.fallback);
    }

    function vinylHtml(sizeClass, imgAttr) {
        return (
            '<div class="sounds-vinyl ' + sizeClass + '">' +
                '<div class="sounds-vinyl-disc">' +
                    '<img class="sounds-vinyl-art" ' + imgAttr + '="" alt="" width="210" height="210" loading="lazy" decoding="async">' +
                    '<span class="sounds-vinyl-grooves" aria-hidden="true"></span>' +
                    '<span class="sounds-vinyl-label" aria-hidden="true"></span>' +
                '</div>' +
            '</div>'
        );
    }

    function restartCenterDiscSpin(container) {
        if (reduceMotion) return;
        var disc = container.querySelector('[data-sounds-main-cell] .sounds-vinyl-disc');
        if (!disc) return;
        disc.classList.remove('is-spinning');
        void disc.offsetHeight;
        disc.classList.add('is-spinning');
    }

    function buildShell(container) {
        container.innerHTML =
            '<div class="sounds-showcase-stage">' +
                '<div class="sounds-showcase-rail" data-sounds-rail>' +
                    '<div class="sounds-showcase-track" data-sounds-track>' +
                        '<div class="sounds-showcase-cell" data-sounds-prev-cell>' +
                            vinylHtml('sounds-vinyl--side', 'data-sounds-prev') +
                        '</div>' +
                        '<div class="sounds-showcase-cell is-current" data-sounds-main-cell>' +
                            vinylHtml('sounds-vinyl--center', 'data-sounds-main') +
                        '</div>' +
                        '<div class="sounds-showcase-cell" data-sounds-next-cell>' +
                            vinylHtml('sounds-vinyl--side', 'data-sounds-next') +
                        '</div>' +
                        '<div class="sounds-showcase-cell" data-sounds-incoming-cell aria-hidden="true">' +
                            vinylHtml('sounds-vinyl--side', 'data-sounds-incoming') +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<p class="sounds-showcase-label" data-sounds-label></p>' +
            '</div>';
        restartCenterDiscSpin(container);
    }

    function applyContent(container, index, options) {
        options = options || {};
        var len = SOUNDS.length;
        var prev = SOUNDS[(index - 1 + len) % len];
        var curr = SOUNDS[index];
        var next = SOUNDS[(index + 1) % len];
        var incoming = SOUNDS[(index + 2) % len];
        var mainImg = container.querySelector('[data-sounds-main]');
        var prevImg = container.querySelector('[data-sounds-prev]');
        var nextImg = container.querySelector('[data-sounds-next]');
        var incomingImg = container.querySelector('[data-sounds-incoming]');
        var label = container.querySelector('[data-sounds-label]');

        setSoundArt(mainImg, curr.art);
        mainImg.alt = soundName(curr);
        setSoundArt(prevImg, prev.art);
        prevImg.alt = soundName(prev);
        setSoundArt(nextImg, next.art);
        nextImg.alt = soundName(next);
        if (!options.skipIncoming) {
            setSoundArt(incomingImg, incoming.art);
            incomingImg.alt = soundName(incoming);
        }
        label.textContent = soundName(curr);
        container.setAttribute('aria-label', homeT('demo.sounds_aria_prefix', 'Calming sound — ') + soundName(curr));
    }

    function prepareIncoming(container, currentIndex) {
        var len = SOUNDS.length;
        var incoming = SOUNDS[(currentIndex + 2) % len];
        var incomingImg = container.querySelector('[data-sounds-incoming]');
        setSoundArt(incomingImg, incoming.art);
        incomingImg.alt = soundName(incoming);
    }

    function settleSlide(container, target) {
        var rail = container.querySelector('[data-sounds-rail]');
        var label = container.querySelector('[data-sounds-label]');

        rail.classList.add('is-settling');
        rail.classList.remove('is-sliding-next');
        void rail.offsetHeight;
        applyContent(container, target);
        void rail.offsetHeight;
        rail.classList.remove('is-settling');

        requestAnimationFrame(function () {
            restartCenterDiscSpin(container);
        });
        label.classList.remove('is-sliding');
        container.dataset.activeIndex = String(target);
        container.dataset.soundsAnimating = 'false';
    }

    function slideTo(container, index, animate) {
        var rail = container.querySelector('[data-sounds-rail]');
        var mainCell = container.querySelector('[data-sounds-main-cell]');
        var label = container.querySelector('[data-sounds-label]');
        var current = parseInt(container.dataset.activeIndex || '0', 10);
        var target = (index + SOUNDS.length) % SOUNDS.length;

        if (target === current && !animate) {
            applyContent(container, target);
            container.dataset.activeIndex = String(target);
            return;
        }

        if (!animate || reduceMotion) {
            rail.classList.remove('is-sliding-next', 'is-settling');
            applyContent(container, target);
            restartCenterDiscSpin(container);
            container.dataset.activeIndex = String(target);
            label.classList.remove('is-sliding');
            container.dataset.soundsAnimating = 'false';
            return;
        }

        if (container.dataset.soundsAnimating === 'true') return;
        container.dataset.soundsAnimating = 'true';

        prepareIncoming(container, current);
        label.classList.add('is-sliding');
        rail.classList.remove('is-settling');
        void rail.offsetHeight;
        rail.classList.add('is-sliding-next');

        function finish() {
            mainCell.removeEventListener('transitionend', onEnd);
            window.clearTimeout(fallbackTimer);
            settleSlide(container, target);
        }

        function onEnd(e) {
            if (e.target !== mainCell) return;
            if (e.propertyName !== 'left' && e.propertyName !== 'transform') return;
            finish();
        }

        var fallbackTimer = window.setTimeout(finish, SLIDE_MS + 100);
        mainCell.addEventListener('transitionend', onEnd);
    }

    window.initSoundsShowcase = function (container) {
        if (!container || container.dataset.soundsReady === 'true') return;
        container.dataset.soundsReady = 'true';
        buildShell(container);

        container.dataset.activeIndex = '0';
        container.dataset.soundsAnimating = 'false';

        var timer = null;

        function startRotation() {
            if (timer) return;
            timer = window.setInterval(function () {
                if (container.dataset.soundsAnimating === 'true') return;
                var active = parseInt(container.dataset.activeIndex || '0', 10);
                slideTo(container, active + 1, true);
            }, ROTATE_MS);
        }

        function stopRotation() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        container.classList.add('is-active');
        applyContent(container, 0);
        startRotation();

        if ('IntersectionObserver' in window) {
            var rotateIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) startRotation();
                    else stopRotation();
                });
            }, { threshold: 0.08 });
            rotateIO.observe(container);
        }
    };

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-sounds-showcase]').forEach(function (el) {
            window.initSoundsShowcase(el);
        });
    }
})();

(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var WORK_MS = 5200;
    var PAUSE_MS = 3200;
    var DEVICE_SWITCH_MS = 900;
    var START_SECONDS = 25 * 60;

    function buildPhoneStatusBar() {
        return '<div class="shield-demo-statusbar" aria-hidden="true">' +
            '<span class="shield-demo-time">9:41</span>' +
            '<span class="shield-demo-status-icons">' +
                '<svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true"><path fill="currentColor" d="M1 8.5h1.5v2H1zm3-2.5h1.5v4.5H4zm3-2h1.5v6.5H7zm3-3h1.5v9.5H10zm3-1.5h1.5V11H13z"/></svg>' +
                '<svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true"><path fill="currentColor" d="M7.2 2.2C5.1 2.2 3.2 3 1.7 4.3l-.9-1C1.6 1.7 4.2.5 7.2.5s5.6 1.2 7.4 2.8l-.9 1c-1.5-1.3-3.4-2.1-5.5-2.1zm0 3.5c-1.2 0-2.3.4-3.2 1.1l-.9-1c1.1-.9 2.5-1.4 4.1-1.4s3 .5 4.1 1.4l-.9 1c-.9-.7-2-1.1-3.2-1.1zm0 3.5c-.7 0-1.3.2-1.8.6l-.9-1c.8-.7 1.9-1.1 2.7-1.1s1.9.4 2.7 1.1l-.9 1c-.5-.4-1.1-.6-1.8-.6z"/></svg>' +
                '<svg width="25" height="11" viewBox="0 0 25 11" aria-hidden="true"><rect x=".5" y=".5" width="20" height="10" rx="2.5" stroke="currentColor" fill="none"/><rect x="2" y="2" width="14" height="7" rx="1.5" fill="currentColor"/><path fill="currentColor" d="M22 4v3h2.5V4z"/></svg>' +
            '</span>' +
        '</div>';
    }

    function daxiCatImgHtml(className, base) {
        return '<img class="timer-demo-cat ' + className + '" ' +
            'src="' + base + '-160w.webp" ' +
            'srcset="' + base + '-160w.webp 160w, ' + base + '-320w.webp 320w" ' +
            'sizes="(max-width: 860px) 34cqi, 160px" ' +
            'alt="" width="160" height="160" decoding="async">';
    }

    function buildTimerScreen(includeStatusBar) {
        return '' +
            (includeStatusBar ? buildPhoneStatusBar() : '') +
            '<div class="timer-demo-texture" aria-hidden="true"></div>' +
            '<div class="timer-demo-top">' +
                '<span class="timer-demo-task">' +
                    '<svg class="timer-demo-task-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                        '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
                        '<circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
                        '<circle cx="12" cy="12" r="2" fill="currentColor"/>' +
                    '</svg>' +
                    '<span>' + homeT('demo.timer.task', 'Focus') + '</span>' +
                '</span>' +
                '<img class="timer-demo-music" src="marketing/music-on-56w.webp" srcset="marketing/music-on-28w.webp 28w, marketing/music-on-56w.webp 56w" sizes="28px" alt="" width="28" height="28" decoding="async">' +
            '</div>' +
            '<div class="timer-demo-main">' +
                '<div class="timer-demo-stage-inner">' +
                    '<div class="timer-demo-backdrop">' +
                        '<div class="timer-demo-backdrop-chrome" aria-hidden="true">' +
                            '<div class="timer-demo-backdrop-halo"></div>' +
                            '<div class="timer-demo-backdrop-ring"></div>' +
                            '<img class="timer-demo-backdrop-img" src="marketing/theme-snow-cinnabar-preview-320w.webp" srcset="marketing/theme-snow-cinnabar-preview-160w.webp 160w, marketing/theme-snow-cinnabar-preview-320w.webp 320w" sizes="(max-width: 860px) 50vw, 320px" alt="" width="320" height="320" decoding="async">' +
                        '</div>' +
                        '<div class="timer-demo-cat-wrap">' +
                            daxiCatImgHtml('timer-demo-cat--work', 'marketing/daxi-work') +
                            daxiCatImgHtml('timer-demo-cat--idle', 'marketing/daxi-idle') +
                        '</div>' +
                    '</div>' +
                    '<div class="timer-demo-digits-wrap">' +
                        '<div class="timer-demo-digits-glow" aria-hidden="true"></div>' +
                        '<p class="timer-demo-digits" data-timer-digits>25:00</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="timer-demo-controls" aria-hidden="true">' +
                '<span class="timer-demo-icon-btn timer-demo-icon-btn--pause"></span>' +
                '<span class="timer-demo-icon-btn timer-demo-icon-btn--play"></span>' +
                '<span class="timer-demo-end-btn">' + homeT('demo.timer.end_btn', 'Press 5s to End') + '</span>' +
            '</div>' +
            '<div class="timer-demo-bottom-space" aria-hidden="true"></div>' +
            '<div class="timer-demo-home-indicator" aria-hidden="true"></div>';
    }

    function buildShell(container) {
        container.innerHTML =
            '<div class="timer-demo-stage">' +
                '<div class="timer-demo-scene timer-demo-scene--phone is-active" data-timer-scene="phone">' +
                    '<div class="timer-demo-phone">' +
                        '<div class="timer-demo-notch" aria-hidden="true"></div>' +
                        '<div class="timer-demo-screen">' + buildTimerScreen(true) + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="timer-demo-scene timer-demo-scene--tablet" data-timer-scene="tablet">' +
                    '<div class="timer-demo-tablet">' +
                        '<div class="timer-demo-screen timer-demo-screen--tablet">' + buildTimerScreen(false) + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    function formatTime(totalSeconds) {
        var mins = Math.floor(totalSeconds / 60);
        var secs = totalSeconds % 60;
        return String(mins) + ':' + String(secs).padStart(2, '0');
    }

    window.initTimerDemo = function (container) {
        if (!container || container.dataset.timerReady === 'true') return;
        container.dataset.timerReady = 'true';
        buildShell(container);

        var digitEls = container.querySelectorAll('[data-timer-digits]');
        var phoneScene = container.querySelector('[data-timer-scene="phone"]');
        var tabletScene = container.querySelector('[data-timer-scene="tablet"]');
        var running = false;
        var abort = { cancelled: false };
        var tickTimer = null;

        function setDigits(text) {
            digitEls.forEach(function (el) {
                el.textContent = text;
            });
        }

        function showDevice(device) {
            if (phoneScene) phoneScene.classList.toggle('is-active', device === 'phone');
            if (tabletScene) tabletScene.classList.toggle('is-active', device === 'tablet');
            container.dataset.timerDevice = device;
        }

        function clearTick() {
            if (tickTimer) {
                window.clearInterval(tickTimer);
                tickTimer = null;
            }
        }

        function setPhase(phase) {
            container.classList.toggle('is-work-phase', phase === 'work');
            container.classList.toggle('is-pause-phase', phase === 'pause');
        }

        function wait(ms) {
            return new Promise(function (resolve) {
                window.setTimeout(resolve, ms);
            });
        }

        async function runWork(token) {
            if (token.cancelled || !running) return;
            setPhase('work');
            var secondsLeft = START_SECONDS;
            setDigits(formatTime(secondsLeft));
            clearTick();
            if (!reduceMotion) {
                tickTimer = window.setInterval(function () {
                    secondsLeft = Math.max(0, secondsLeft - 1);
                    setDigits(formatTime(secondsLeft));
                }, 1000);
            }
            await wait(WORK_MS);
            clearTick();
            if (token.cancelled) return;
            await runPause(token);
        }

        async function runPause(token) {
            if (token.cancelled || !running) return;
            setPhase('pause');
            await wait(PAUSE_MS);
        }

        async function runDeviceCycle(token, device) {
            if (token.cancelled || !running) return;
            showDevice(device);
            await runWork(token);
        }

        async function runFullCycle(token) {
            await runDeviceCycle(token, 'phone');
            if (token.cancelled || !running) return;
            if (!reduceMotion) await wait(DEVICE_SWITCH_MS);
            if (token.cancelled || !running) return;
            await runDeviceCycle(token, 'tablet');
            if (token.cancelled || !running) return;
            if (!reduceMotion) await wait(DEVICE_SWITCH_MS);
            if (token.cancelled || !running) return;
            await runFullCycle(token);
        }

        function start() {
            if (running) return;
            running = true;
            abort.cancelled = false;
            container.classList.add('is-active');
            if (reduceMotion) {
                showDevice('phone');
                setPhase('work');
                setDigits('25:00');
                return;
            }
            runFullCycle(abort);
        }

        function stop() {
            running = false;
            abort.cancelled = true;
            abort = { cancelled: true };
            clearTick();
            container.classList.remove('is-active', 'is-work-phase', 'is-pause-phase');
            delete container.dataset.timerDevice;
        }

        showDevice('phone');
        setPhase('work');
        setDigits(formatTime(START_SECONDS));

        if ('IntersectionObserver' in window) {
            var timerIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) start();
                    else stop();
                });
            }, { threshold: 0.2 });
            timerIO.observe(container);
        } else {
            start();
        }
    };

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-timer-demo]').forEach(function (el) {
            window.initTimerDemo(el);
        });
    }
})();

(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function buildShell(container) {
        container.innerHTML =
            '<div class="shield-demo-phone" data-shield-phone>' +
                '<div class="shield-demo-notch" aria-hidden="true"></div>' +
                '<div class="shield-demo-screen">' +
                    '<div class="shield-demo-statusbar" aria-hidden="true">' +
                        '<span class="shield-demo-time">9:41</span>' +
                        '<span class="shield-demo-status-icons">' +
                            '<svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true"><path fill="currentColor" d="M1 8.5h1.5v2H1zm3-2.5h1.5v4.5H4zm3-2h1.5v6.5H7zm3-3h1.5v9.5H10zm3-1.5h1.5V11H13z"/></svg>' +
                            '<svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true"><path fill="currentColor" d="M7.2 2.2C5.1 2.2 3.2 3 1.7 4.3l-.9-1C1.6 1.7 4.2.5 7.2.5s5.6 1.2 7.4 2.8l-.9 1c-1.5-1.3-3.4-2.1-5.5-2.1zm0 3.5c-1.2 0-2.3.4-3.2 1.1l-.9-1c1.1-.9 2.5-1.4 4.1-1.4s3 .5 4.1 1.4l-.9 1c-.9-.7-2-1.1-3.2-1.1zm0 3.5c-.7 0-1.3.2-1.8.6l-.9-1c.8-.7 1.9-1.1 2.7-1.1s1.9.4 2.7 1.1l-.9 1c-.5-.4-1.1-.6-1.8-.6z"/></svg>' +
                            '<svg width="25" height="11" viewBox="0 0 25 11" aria-hidden="true"><rect x=".5" y=".5" width="20" height="10" rx="2.5" stroke="currentColor" fill="none"/><rect x="2" y="2" width="14" height="7" rx="1.5" fill="currentColor"/><path fill="currentColor" d="M22 4v3h2.5V4z"/></svg>' +
                        '</span>' +
                    '</div>' +
                    '<div class="shield-demo-wallpaper" aria-hidden="true"></div>' +
                    '<div class="shield-demo-apps">' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--calendar" aria-hidden="true"></span><span class="shield-demo-app-name">Calendar</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--photos" aria-hidden="true"></span><span class="shield-demo-app-name">Photos</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--focus" aria-hidden="true"><img src="AppIcon-Preview-128.webp" alt="" width="64" height="64"></span><span class="shield-demo-app-name">' + homeT('demo.app_name', 'PurrrrrFocus') + '</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--mail" aria-hidden="true"></span><span class="shield-demo-app-name">Mail</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--music" aria-hidden="true"></span><span class="shield-demo-app-name">Music</span></div>' +
                        '<div class="shield-demo-app shield-demo-app--social" data-shield-social tabindex="-1">' +
                            '<span class="shield-demo-app-icon shield-demo-app-icon--social" data-shield-social-icon aria-hidden="true"></span>' +
                            '<span class="shield-demo-app-name">Social</span>' +
                        '</div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--notes" aria-hidden="true"></span><span class="shield-demo-app-name">Notes</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--maps" aria-hidden="true"></span><span class="shield-demo-app-name">Maps</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--weather" aria-hidden="true"></span><span class="shield-demo-app-name">Weather</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--reminders" aria-hidden="true"></span><span class="shield-demo-app-name">Reminders</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--tv" aria-hidden="true"></span><span class="shield-demo-app-name">TV</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--podcasts" aria-hidden="true"></span><span class="shield-demo-app-name">Podcasts</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--wallet" aria-hidden="true"></span><span class="shield-demo-app-name">Wallet</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--health" aria-hidden="true"></span><span class="shield-demo-app-name">Health</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--settings" aria-hidden="true"></span><span class="shield-demo-app-name">Settings</span></div>' +
                        '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--files" aria-hidden="true"></span><span class="shield-demo-app-name">Files</span></div>' +
                    '</div>' +
                    '<div class="shield-demo-dock" aria-hidden="true">' +
                        '<span class="shield-demo-dock-icon shield-demo-app-icon shield-demo-app-icon--phone"></span>' +
                        '<span class="shield-demo-dock-icon shield-demo-app-icon shield-demo-app-icon--safari"></span>' +
                        '<span class="shield-demo-dock-icon shield-demo-app-icon shield-demo-app-icon--messages"></span>' +
                        '<span class="shield-demo-dock-icon shield-demo-app-icon shield-demo-app-icon--music"></span>' +
                    '</div>' +
                    '<div class="shield-demo-home-indicator" aria-hidden="true"></div>' +
                '</div>' +
                '<div class="shield-demo-overlay" data-shield-overlay aria-hidden="true">' +
                    '<div class="shield-demo-shield">' +
                        '<div class="shield-demo-shield-body">' +
                            '<img class="shield-demo-shield-icon" src="AppIcon-Preview-128.webp" alt="" width="72" height="72">' +
                            '<p class="shield-demo-shield-title">' + homeT('demo.shield.title', "Don't break the flow") + '</p>' +
                            '<p class="shield-demo-shield-subtitle">' + homeT('demo.shield.subtitle', "Your focus session isn't over yet. Please stay focused.") + '</p>' +
                        '</div>' +
                        '<div class="shield-demo-shield-actions">' +
                            '<button type="button" class="shield-demo-shield-primary" data-shield-gotit>' + homeT('demo.shield.got_it', 'Got it') + '</button>' +
                            '<button type="button" class="shield-demo-shield-secondary" data-shield-close tabindex="-1">' + homeT('demo.shield.close', 'Close') + '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="shield-demo-pointer" data-shield-pointer aria-hidden="true"></div>' +
            '</div>';
    }

    function wait(ms) {
        return new Promise(function (resolve) {
            window.setTimeout(resolve, ms);
        });
    }

    function getTargetPercent(container, el) {
        var phone = container.querySelector('[data-shield-phone]');
        if (!phone || !el) return { x: 50, y: 50 };
        var pr = phone.getBoundingClientRect();
        var er = el.getBoundingClientRect();
        return {
            x: ((er.left + er.width / 2 - pr.left) / pr.width) * 100,
            y: ((er.top + er.height / 2 - pr.top) / pr.height) * 100
        };
    }

    function movePointer(container, x, y, pressing) {
        var pointer = container.querySelector('[data-shield-pointer]');
        if (!pointer) return;
        pointer.style.setProperty('--ptr-x', x + '%');
        pointer.style.setProperty('--ptr-y', y + '%');
        pointer.classList.toggle('is-pressing', !!pressing);
        pointer.classList.add('is-visible');
        container.classList.toggle('is-pointer-press', !!pressing);
    }

    function hidePointer(container) {
        var pointer = container.querySelector('[data-shield-pointer]');
        if (pointer) {
            pointer.classList.remove('is-visible', 'is-pressing');
        }
        container.classList.remove('is-pointer-press');
    }

    function setShieldOpen(container, open) {
        var overlay = container.querySelector('[data-shield-overlay]');
        var social = container.querySelector('[data-shield-social]');
        container.classList.toggle('is-shield-open', open);
        if (overlay) overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
        if (social) social.classList.toggle('is-tapped', open);
    }

    window.initShieldDemo = function (container) {
        if (!container || container.dataset.shieldReady === 'true') return;
        container.dataset.shieldReady = 'true';
        buildShell(container);

        var running = false;
        var cycleTimer = null;
        var abortToken = { cancelled: false };

        function resetView() {
            setShieldOpen(container, false);
            hidePointer(container);
            container.classList.remove('is-social-pulse', 'is-pressing-gotit');
        }

        async function runCycle(token) {
            if (token.cancelled || !running) return;
            resetView();
            await wait(900);
            if (token.cancelled) return;

            container.classList.add('is-social-pulse');
            var socialIcon = container.querySelector('[data-shield-social-icon]');
            var socialPos = getTargetPercent(container, socialIcon);
            movePointer(container, socialPos.x, socialPos.y, false);
            await wait(600);
            if (token.cancelled) return;

            movePointer(container, socialPos.x, socialPos.y, true);
            await wait(200);
            if (token.cancelled) return;

            movePointer(container, socialPos.x, socialPos.y, false);
            setShieldOpen(container, true);
            await wait(1700);
            if (token.cancelled) return;

            var gotIt = container.querySelector('[data-shield-gotit]');
            var gotItPos = getTargetPercent(container, gotIt);
            movePointer(container, gotItPos.x, gotItPos.y, false);
            await wait(650);
            if (token.cancelled) return;

            container.classList.add('is-pressing-gotit');
            movePointer(container, gotItPos.x, gotItPos.y, true);
            await wait(280);
            if (token.cancelled) return;

            container.classList.remove('is-pressing-gotit');
            movePointer(container, gotItPos.x, gotItPos.y, false);
            setShieldOpen(container, false);
            hidePointer(container);
            container.classList.remove('is-social-pulse');
            await wait(1100);
            if (token.cancelled) return;

            runCycle(token);
        }

        function start() {
            if (running) return;
            running = true;
            abortToken.cancelled = false;
            container.classList.add('is-active');
            if (reduceMotion) {
                setShieldOpen(container, true);
                return;
            }
            runCycle(abortToken);
        }

        function stop() {
            running = false;
            abortToken.cancelled = true;
            abortToken = { cancelled: true };
            container.classList.remove('is-active', 'is-social-pulse', 'is-pressing-gotit');
            resetView();
        }

        if ('IntersectionObserver' in window) {
            var shieldIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) start();
                    else stop();
                });
            }, { threshold: 0.2 });
            shieldIO.observe(container);
        } else {
            start();
        }
    };

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-shield-demo]').forEach(function (el) {
            window.initShieldDemo(el);
        });
    }
})();

(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ISLAND_MS = 4200;
    var LOCK_MS = 4500;
    var START_SECONDS = 24 * 60 + 55;

    function buildShell(container) {
        var statusBar =
            '<div class="shield-demo-statusbar" aria-hidden="true">' +
                '<span class="shield-demo-time">9:41</span>' +
                '<span class="shield-demo-status-icons">' +
                    '<svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true"><path fill="currentColor" d="M1 8.5h1.5v2H1zm3-2.5h1.5v4.5H4zm3-2h1.5v6.5H7zm3-3h1.5v9.5H10zm3-1.5h1.5V11H13z"/></svg>' +
                    '<svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true"><path fill="currentColor" d="M7.2 2.2C5.1 2.2 3.2 3 1.7 4.3l-.9-1C1.6 1.7 4.2.5 7.2.5s5.6 1.2 7.4 2.8l-.9 1c-1.5-1.3-3.4-2.1-5.5-2.1zm0 3.5c-1.2 0-2.3.4-3.2 1.1l-.9-1c1.1-.9 2.5-1.4 4.1-1.4s3 .5 4.1 1.4l-.9 1c-.9-.7-2-1.1-3.2-1.1zm0 3.5c-.7 0-1.3.2-1.8.6l-.9-1c.8-.7 1.9-1.1 2.7-1.1s1.9.4 2.7 1.1l-.9 1c-.5-.4-1.1-.6-1.8-.6z"/></svg>' +
                    '<svg width="25" height="11" viewBox="0 0 25 11" aria-hidden="true"><rect x=".5" y=".5" width="20" height="10" rx="2.5" stroke="currentColor" fill="none"/><rect x="2" y="2" width="14" height="7" rx="1.5" fill="currentColor"/><path fill="currentColor" d="M22 4v3h2.5V4z"/></svg>' +
                '</span>' +
            '</div>';

        var homeApps =
            '<div class="shield-demo-apps" aria-hidden="true">' +
                '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--calendar" aria-hidden="true"></span><span class="shield-demo-app-name">Calendar</span></div>' +
                '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--photos" aria-hidden="true"></span><span class="shield-demo-app-name">Photos</span></div>' +
                '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--focus" aria-hidden="true"><img src="AppIcon-Preview-128.webp" alt="" width="64" height="64"></span><span class="shield-demo-app-name">' + homeT('demo.app_name', 'PurrrrrFocus') + '</span></div>' +
                '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--mail" aria-hidden="true"></span><span class="shield-demo-app-name">Mail</span></div>' +
                '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--music" aria-hidden="true"></span><span class="shield-demo-app-name">Music</span></div>' +
                '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--notes" aria-hidden="true"></span><span class="shield-demo-app-name">Notes</span></div>' +
                '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--maps" aria-hidden="true"></span><span class="shield-demo-app-name">Maps</span></div>' +
                '<div class="shield-demo-app"><span class="shield-demo-app-icon shield-demo-app-icon--weather" aria-hidden="true"></span><span class="shield-demo-app-name">Weather</span></div>' +
            '</div>' +
            '<div class="shield-demo-dock" aria-hidden="true">' +
                '<span class="shield-demo-dock-icon shield-demo-app-icon shield-demo-app-icon--phone"></span>' +
                '<span class="shield-demo-dock-icon shield-demo-app-icon shield-demo-app-icon--safari"></span>' +
                '<span class="shield-demo-dock-icon shield-demo-app-icon shield-demo-app-icon--messages"></span>' +
                '<span class="shield-demo-dock-icon shield-demo-app-icon shield-demo-app-icon--music"></span>' +
            '</div>' +
            '<div class="shield-demo-home-indicator" aria-hidden="true"></div>';

        container.innerHTML =
            '<div class="live-demo-stage">' +
                '<div class="live-demo-scene live-demo-scene--island is-active" data-live-scene="island">' +
                    '<div class="live-demo-phone">' +
                        '<div class="live-demo-screen">' +
                            statusBar +
                            '<div class="live-demo-wallpaper live-demo-wallpaper--home" aria-hidden="true"></div>' +
                            homeApps +
                        '</div>' +
                        '<div class="live-demo-di live-demo-di--compact" aria-hidden="true">' +
                            '<img class="live-demo-di-icon" src="marketing/app-icon-live-activity-64w.webp" srcset="marketing/app-icon-live-activity-32w.webp 32w, marketing/app-icon-live-activity-64w.webp 64w" sizes="16px" alt="" decoding="async">' +
                            '<span class="live-demo-di-time" data-live-digits>24:55</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="live-demo-scene live-demo-scene--lock" data-live-scene="lock">' +
                    '<div class="live-demo-phone">' +
                        '<div class="live-demo-screen">' +
                            statusBar +
                            '<div class="live-demo-wallpaper live-demo-wallpaper--lock" aria-hidden="true"></div>' +
                        '</div>' +
                        '<div class="live-demo-lock-clock-wrap">' +
                            '<p class="live-demo-lock-clock">9:41</p>' +
                            '<p class="live-demo-lock-date">' + homeT('demo.live.lock_date', 'Wednesday, June 24') + '</p>' +
                        '</div>' +
                        '<div class="live-demo-la-card">' +
                            '<div class="live-demo-la-row">' +
                                '<img class="live-demo-la-icon" src="marketing/app-icon-live-activity-64w.webp" srcset="marketing/app-icon-live-activity-32w.webp 32w, marketing/app-icon-live-activity-64w.webp 64w" sizes="16px" alt="" decoding="async">' +
                                '<span class="live-demo-la-title">' + homeT('demo.live.task', 'Focus') + '</span>' +
                                '<span class="live-demo-la-time" data-live-digits>24:55</span>' +
                            '</div>' +
                            '<p class="live-demo-la-sub">' + homeT('demo.live.phase', 'Focus Phase') + '</p>' +
                        '</div>' +
                        '<div class="live-demo-home-bar" aria-hidden="true"></div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    function formatTime(totalSeconds) {
        var mins = Math.floor(totalSeconds / 60);
        var secs = totalSeconds % 60;
        return String(mins) + ':' + String(secs).padStart(2, '0');
    }

    window.initLiveDemo = function (container) {
        if (!container || container.dataset.liveReady === 'true') return;
        container.dataset.liveReady = 'true';
        buildShell(container);

        var islandScene = container.querySelector('[data-live-scene="island"]');
        var lockScene = container.querySelector('[data-live-scene="lock"]');
        var digitEls = container.querySelectorAll('[data-live-digits]');
        var running = false;
        var abort = { cancelled: false };
        var tickTimer = null;
        var scene = 'island';

        function clearTick() {
            if (tickTimer) {
                window.clearInterval(tickTimer);
                tickTimer = null;
            }
        }

        function setDigits(secondsLeft) {
            var text = formatTime(secondsLeft);
            digitEls.forEach(function (el) {
                el.textContent = text;
            });
        }

        function setScene(next) {
            scene = next;
            islandScene.classList.toggle('is-active', next === 'island');
            lockScene.classList.toggle('is-active', next === 'lock');
        }

        function wait(ms) {
            return new Promise(function (resolve) {
                window.setTimeout(resolve, ms);
            });
        }

        async function runIsland(token) {
            if (token.cancelled || !running) return;
            setScene('island');
            await wait(ISLAND_MS);
            if (token.cancelled) return;
            await runLock(token);
        }

        async function runLock(token) {
            if (token.cancelled || !running) return;
            setScene('lock');
            await wait(LOCK_MS);
            if (token.cancelled) return;
            await runIsland(token);
        }

        function start() {
            if (running) return;
            running = true;
            abort.cancelled = false;
            container.classList.add('is-active');
            var secondsLeft = START_SECONDS;
            setDigits(secondsLeft);
            setScene('island');
            clearTick();
            if (!reduceMotion) {
                tickTimer = window.setInterval(function () {
                    secondsLeft = Math.max(0, secondsLeft - 1);
                    setDigits(secondsLeft);
                }, 1000);
                runIsland(abort);
            }
        }

        function stop() {
            running = false;
            abort.cancelled = true;
            abort = { cancelled: true };
            clearTick();
            container.classList.remove('is-active');
            setScene('island');
        }

        setScene('island');
        setDigits(START_SECONDS);

        if ('IntersectionObserver' in window) {
            var liveIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) start();
                    else stop();
                });
            }, { threshold: 0.2 });
            liveIO.observe(container);
        } else {
            start();
        }
    };

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-live-demo]').forEach(function (el) {
            window.initLiveDemo(el);
        });
    }
})();