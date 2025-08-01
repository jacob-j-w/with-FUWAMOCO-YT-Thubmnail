// ==UserScript==
// @name         YouTube "with FUWAMOCO" Thumbnail Badge
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a "with FUWAMOCO" overlay image badge to YouTube video thumbnails (bottom-right corner, 40% size).
// @author       Jacob J W
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const fuwamocoBadgeUrl = "https://i.imgur.com/W8rdKlO.png";

    function injectFuwamocoBadges() {
        const thumbnails = document.querySelectorAll('yt-thumbnail-view-model');

        thumbnails.forEach(thumbnail => {
            // Skip if already injected
            if (thumbnail.dataset.fuwamocoInjected) return;
            thumbnail.dataset.fuwamocoInjected = "true";

            // Ensure thumbnail can contain absolutely positioned children
            thumbnail.style.position = "relative";

            // Create badge wrapper
            const badgeContainer = document.createElement("div");
            badgeContainer.className = "yt-thumbnail-view-model__image";

            // Create FUWAMOCO image element
            const badgeImg = document.createElement("img");
            badgeImg.alt = "with FUWAMOCO";
            badgeImg.className = "yt-core-image yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image--content-mode-scale-aspect-fill yt-core-image--loaded";
            badgeImg.src = fuwamocoBadgeUrl;
            badgeImg.setAttribute("data-fuwamoco", "true");

            // Style image overlay
            badgeImg.style.position = "absolute";
            badgeImg.style.bottom = "0";
            badgeImg.style.right = "0";
            badgeImg.style.width = "40%";
            badgeImg.style.height = "auto";
            badgeImg.style.zIndex = "1";

            // Inject overlay into thumbnail
            badgeContainer.appendChild(badgeImg);
            thumbnail.appendChild(badgeContainer);
        });

        // Make sure YouTube badge overlays (like "LIVE", "4K", etc.) show above FUWAMOCO badge
        const overlayBadges = document.querySelectorAll('yt-thumbnail-overlay-badge-view-model');
        overlayBadges.forEach(badge => {
            badge.style.zIndex = "2";
        });
    }

    // Run initially
    window.addEventListener('load', injectFuwamocoBadges);

    // Observe changes due to SPA navigation or dynamic loading
    const observer = new MutationObserver(injectFuwamocoBadges);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
