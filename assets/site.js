(() => {
  'use strict';

  const config = window.CHALK_ARCADE_SITE || {};
  const stores = ['android', 'ios'];

  const isValidStoreUrl = (store, value) => {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') return false;
      return store === 'android'
        ? url.hostname === 'play.google.com'
        : url.hostname === 'apps.apple.com';
    } catch (_) {
      return false;
    }
  };

  for (const store of stores) {
    const entry = config[store] || {};
    const available = entry.published === true && isValidStoreUrl(store, entry.url);
    for (const link of document.querySelectorAll(`[data-store="${store}"]`)) {
      if (available) {
        link.href = entry.url;
        link.removeAttribute('aria-disabled');
        link.classList.add('is-available');
        const status = link.querySelector('[data-store-status]');
        if (status) status.textContent = store === 'android' ? 'Get it on Google Play' : 'Download on the App Store';
      } else {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        const status = link.querySelector('[data-store-status]');
        if (status) status.textContent = 'Coming soon';
      }
    }
  }

  const platform = (() => {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return 'ios';
    return null;
  })();

  const pathIsHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
  const stay = new URLSearchParams(window.location.search).get('stay') === '1';
  let redirectedThisSession = false;
  try {
    redirectedThisSession = sessionStorage.getItem('chalk-store-redirected') === '1';
  } catch (_) {
    // Storage can be unavailable in strict browsing modes; redirect still works.
  }

  const target = platform ? config[platform] : null;
  const canRedirect =
    pathIsHome &&
    !stay &&
    !redirectedThisSession &&
    target?.published === true &&
    isValidStoreUrl(platform, target.url);

  if (!canRedirect) return;

  const notice = document.querySelector('[data-redirect-notice]');
  const cancel = document.querySelector('[data-cancel-redirect]');
  const platformName = platform === 'android' ? 'Google Play' : 'the App Store';
  if (notice) {
    notice.hidden = false;
    const message = notice.querySelector('[data-redirect-message]');
    if (message) message.textContent = `Opening ${platformName}…`;
  }

  let cancelled = false;
  const timer = window.setTimeout(() => {
    if (cancelled) return;
    try {
      sessionStorage.setItem('chalk-store-redirected', '1');
    } catch (_) {
      // The redirect does not depend on storage.
    }
    window.location.replace(target.url);
  }, Number(config.redirectDelayMs) || 1800);

  cancel?.addEventListener('click', () => {
    cancelled = true;
    window.clearTimeout(timer);
    if (notice) notice.hidden = true;
  });
})();
