(function () {
    'use strict';

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

    function showPreview(root, preview) {
        root.classList.remove('islands-picker--preview-hidden');
        preview.hidden = false;
        preview.removeAttribute('aria-hidden');
    }

    function hidePreview(root, preview) {
        root.classList.add('islands-picker--preview-hidden');
        preview.hidden = true;
        preview.setAttribute('aria-hidden', 'true');
    }

    function updateMedia(preview, data) {
        var picture = preview.querySelector('picture');
        if (!picture) {
            return;
        }

        picture.innerHTML =
            '<source class="islands-preview__source" type="image/webp" srcset="' + data.webp + '">' +
            '<img class="islands-preview__media" src="' + data.png + '" alt="' + data.label.replace(/"/g, '&quot;') +
            '" width="1200" height="900" decoding="async">';
    }

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
            hidePreview(root, preview);
            return;
        }

        showPreview(root, preview);
        preview.setAttribute('aria-labelledby', 'island-tab-' + islandId);
        preview.setAttribute('aria-label', data.label);
        updateMedia(preview, data);
    }

    function initIslandsPicker(root) {
        var cards = Array.prototype.slice.call(root.querySelectorAll('.islands-grid [data-island]'));
        var preview = root.querySelector('.islands-preview');
        if (!cards.length || !preview) {
            return;
        }

        var initial = root.getAttribute('data-initial-island') || 'ellidaey';

        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                setActive(root, cards, preview, card.getAttribute('data-island'));
            });
        });

        setActive(root, cards, preview, initial);
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
