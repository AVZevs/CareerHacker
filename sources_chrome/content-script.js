// Gosuslugi and HH.RU Career Hacker Browser Extension [1.1]
// Contact the author via Telegram @Zevs_AV or @DTorretto
// © 2025 Gosuslugi and HH.RU Career Hacker: Advanced Tab Tracking Blocker Browser Extension. Все права защищены.
// Official Site: https://careerhack.hitsecurity.ru
const overrideAPI = () => {
  const override = (obj, prop, value) => {
    try {
      Object.defineProperty(obj, prop, {
        get: () => value,
        set: () => {},
        configurable: false,
        enumerable: true
      });
    } catch(e) {
      console.error(`AntiTrack: Failed to override ${prop}`, e);
    }
  };

  override(document, 'hidden', false);
  override(document, 'visibilityState', 'visible');
  override(document, 'webkitHidden', false);
  override(document, 'webkitVisibilityState', 'visible');
  override(document, 'msHidden', false);
  override(document, 'msVisibilityState', 'visible');
  // Contact the author via Telegram @Zevs_AV or @DTorretto
  override(document, 'onvisibilitychange', null);
  override(window, 'onfocus', null);
  override(window, 'onblur', null);
};

const blockEvents = () => {
  const block = e => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    return false;
  };

  const events = [
    'focus', 'blur', 'focusin', 'focusout',
    'visibilitychange', 'webkitvisibilitychange',
    'msvisibilitychange', 'pagehide', 'pageshow'
  ];

  events.forEach(ev => {
    window.addEventListener(ev, block, true);
    document.addEventListener(ev, block, true);
  });
};

const interceptTimers = () => {
  const originalSI = window.setInterval;
  const originalST = window.setTimeout;
  // Contact the author via Telegram @Zevs_AV or @DTorretto
  window.setInterval = function(callback, delay, ...args) {
    if (delay < 3000 || /(visibility|hidden|focus)/i.test(callback.toString())) {
      return 0;
    }
    return originalSI.apply(window, [callback, delay, ...args]);
  };

  window.setTimeout = function(callback, delay, ...args) {
    if (/(visibility|hidden|focus)/i.test(callback.toString())) {
      return 0;
    }
    return originalST.apply(window, [callback, delay, ...args]);
  };
};

const blockIdleCallbacks = () => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback = callback => {
      if (/(visibility|hidden|focus)/i.test(callback.toString())) {
        return 0;
      }
      return window.setTimeout(callback, 0);
    };
  }
};

overrideAPI();
blockEvents();
interceptTimers();
blockIdleCallbacks();

const injectToIFrames = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
};

injectToIFrames();
