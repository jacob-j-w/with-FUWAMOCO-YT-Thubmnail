// ==UserScript==
// @name         YouTube "with FUWAMOCO" Thumbnail Badge
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a "with FUWAMOCO" overlay image badge to YouTube video thumbnails (bottom-right corner, 40% size).
// @author       Jacob J W
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const fuwamocoBadgeUrl = "https://i.imgur.com/W8rdKlO.png";

    function injectFuwamocoBadges() {
        // === CASE 1: <yt-thumbnail-view-model>
        const ytThumbnailElements = document.querySelectorAll('yt-thumbnail-view-model');
        ytThumbnailElements.forEach(thumbnail => {
            if (thumbnail.dataset.fuwamocoInjected) return;
            thumbnail.dataset.fuwamocoInjected = "true";

            thumbnail.style.position = "relative";

            const badgeImg = createFuwamocoBadge();
            thumbnail.appendChild(badgeImg);
        });

        // === CASE 2: <ytd-thumbnail> containing <yt-image>
        const ytdThumbnails = document.querySelectorAll('ytd-thumbnail yt-image');
        ytdThumbnails.forEach(ytImage => {
            const thumbnail = ytImage.closest('ytd-thumbnail');
            if (!thumbnail || thumbnail.dataset.fuwamocoInjected) return;

            thumbnail.dataset.fuwamocoInjected = "true";
            thumbnail.style.position = "relative";

            const badgeImg = createFuwamocoBadge();
            ytImage.appendChild(badgeImg);
        });

        // === Overlay badges (LIVE, 4K, Duration, etc.)
        const overlaySelectors = [
            'yt-thumbnail-overlay-badge-view-model',
            'ytd-thumbnail-overlay-time-status-renderer',
            'ytd-thumbnail-overlay-now-playing-renderer'
        ];

        document.querySelectorAll(overlaySelectors.join(',')).forEach(badge => {
            badge.style.zIndex = "2";
        });
    }

    function createFuwamocoBadge() {
        const img = document.createElement("img");
        img.alt = "with FUWAMOCO";
        img.src = fuwamocoBadgeUrl;
        img.setAttribute("data-fuwamoco", "true");
        img.className = "yt-core-image yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image--content-mode-scale-aspect-fill yt-core-image--loaded";

        img.style.position = "absolute";
        img.style.bottom = "0";
        img.style.right = "0";
        img.style.width = "40%";
        img.style.height = "auto";
        img.style.zIndex = "1";
        img.style.pointerEvents = "none";

        return img;
    }

    // Run on load
    window.addEventListener('load', injectFuwamocoBadges);

    // Observe changes due to SPA navigation or dynamic loading
    const observer = new MutationObserver(injectFuwamocoBadges);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
