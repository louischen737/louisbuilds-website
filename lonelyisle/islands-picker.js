(function () {
    'use strict';

    var MOBILE_MQ = window.matchMedia('(max-width: 768px)');

    function isMobileView() {
        return MOBILE_MQ.matches;
    }

    var ISLANDS = {
        ellidaey: {
            label: 'Elliðaey bird\u2019s-eye map with lodge, puffin, and cliff spots',
            webp: 'images/islands/ellidaey-birdseye-1200w.webp',
            png: 'images/islands/ellidaey-birdseye-1200w.png'
        },
        twilight: {
            label: 'Blue Hour bird\u2019s-eye map with fountain, greenhouse, ship, and harbor spots',
            webp: 'images/islands/twilight-birdseye-1200w.webp',
            png: 'images/islands/twilight-birdseye-1200w.png'
        },
        naoshima: {
            label: 'Naoshima bird\u2019s-eye map with art landmarks and pumpkin spots',
            webp: 'images/islands/naoshima-birdseye-1200w.webp',
            png: 'images/islands/naoshima-birdseye-1200w.png'
        },
        heartreef: {
            label: 'Heart Reef preview coming soon',
            comingSoon: true
        }
    };

    function setActive(root, cards, preview, islandId) {
        var data = ISLANDS[islandId];
        if (!data) {
            return;
        }

        cards.forEach(function (card) {
            var isActive = card.getAttribute('data-island') === islandId;
            card.classList.toggle('is-active', isActive);
            card.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        if (data.comingSoon) {
            root.classList.add('islands-picker--preview-hidden');
            preview.setAttribute('aria-hidden', 'true');
            preview.setAttribute('hidden', 'hidden');
            return;
        }

        root.classList.remove('islands-picker--preview-hidden');
        preview.removeAttribute('aria-hidden');
        preview.removeAttribute('hidden');
        preview.setAttribute('aria-labelledby', 'island-tab-' + islandId);

        var img = preview.querySelector('.islands-preview__media');
        var source = preview.querySelector('.islands-preview__source');

        if (source) {
            source.srcset = data.webp;
        }
        if (img) {
            img.src = data.png;
            img.alt = data.label;
        }
        preview.setAttribute('aria-label', data.label);
    }

    function hidePreview(root, preview) {
        root.classList.add('islands-picker--preview-hidden');
        preview.setAttribute('aria-hidden', 'true');
        preview.setAttribute('hidden', 'hidden');
    }

    function clearCardSelection(cards) {
        cards.forEach(function (card) {
            card.classList.remove('is-active');
            card.setAttribute('aria-selected', 'false');
        });
    }

    function initIslandsPicker(root) {
        var cards = Array.prototype.slice.call(root.querySelectorAll('.islands-grid [data-island]'));
        var preview = root.querySelector('.islands-preview');
        if (!cards.length || !preview) {
            return;
        }

        var currentIsland = root.getAttribute('data-initial-island') || 'ellidaey';

        function select(islandId) {
            currentIsland = islandId;
            setActive(root, cards, preview, islandId);
        }

        function applyLayout() {
            if (isMobileView()) {
                hidePreview(root, preview);
                clearCardSelection(cards);
                return;
            }

            select(currentIsland);
        }

        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                if (isMobileView()) {
                    return;
                }
                select(card.getAttribute('data-island'));
            });
        });

        if (typeof MOBILE_MQ.addEventListener === 'function') {
            MOBILE_MQ.addEventListener('change', applyLayout);
        } else if (typeof MOBILE_MQ.addListener === 'function') {
            MOBILE_MQ.addListener(applyLayout);
        }

        applyLayout();
    }

    function boot() {
        document.querySelectorAll('[data-islands-picker]').forEach(initIslandsPicker);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
