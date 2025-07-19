// Gosuslugi and HH.RU Career Hacker Browser Extension [1.1]
// Contact the author via Telegram @Zevs_AV or @DTorretto
// © 2025 Gosuslugi and HH.RU Career Hacker: Advanced Tab Tracking Blocker Browser Extension. Все права защищены.
// Official Site: https://careerhack.hitsecurity.ru
(function() {
  const overrideVisibility = () => {
    const props = {
      'hidden': false,
      'visibilityState': 'visible',
      'webkitHidden': false,
      'webkitVisibilityState': 'visible',
      'msHidden': false,
      'msVisibilityState': 'visible',
      'mozHidden': false,
      'mozVisibilityState': 'visible'
    };

    Object.keys(props).forEach(prop => {
      try {
        Object.defineProperty(document, prop, {
          get: () => props[prop],
          configurable: false,
          enumerable: true
        });
      } catch(e) {}
    });
  };
  // Contact the author via Telegram @Zevs_AV or @DTorretto
  const blockTrackingEvents = () => {
    const block = e => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      return false;
    };

    const events = [
      'focus', 'blur', 'focusin', 'focusout',
      'visibilitychange', 'webkitvisibilitychange',
      'msvisibilitychange', 'mozvisibilitychange',
      'pagehide', 'pageshow', 'freeze', 'resume'
    ];
    // Contact the author via Telegram @Zevs_AV or @DTorretto
    events.forEach(ev => {
      window.addEventListener(ev, block, true);
      document.addEventListener(ev, block, true);
    });
  };

  const interceptTimers = () => {
    const originalSI = window.setInterval;
    const originalST = window.setTimeout;

    window.setInterval = function(callback, delay, ...args) {
      if (delay < 5000 || /(visib|hidden|focus|blur|idle)/i.test(callback.toString())) {
        return 0;
      }
      return originalSI.apply(window, [callback, delay, ...args]);
    };

    window.setTimeout = function(callback, delay, ...args) {
      if (/(visib|hidden|focus|blur|idle)/i.test(callback.toString())) {
        return 0;
      }
      return originalST.apply(window, [callback, delay, ...args]);
    };
  };

  const protectAdvancedAPIs = () => {
    Object.defineProperty(window, 'Worker', {
      value: function() {
        return {
          postMessage: () => {},
          terminate: () => {}
        };
      },
      configurable: false
    });

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback = callback => {
        if (/(visib|hidden|focus)/i.test(callback.toString())) {
          return 0;
        }
        return window.setTimeout(callback, 0);
      };
    }

    if ('performance' in window) {
      const originalGetEntries = performance.getEntries;
      performance.getEntries = function() {
        return originalGetEntries.apply(performance).filter(entry => 
          !entry.name.includes('visibility') && 
          !entry.name.includes('focus')
        );
      };
    }
  };

  const injectFrameProtection = () => {
    const script = document.createElement('script');
    script.src = browser.runtime.getURL('inject.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  };

  overrideVisibility();
  blockTrackingEvents();
  interceptTimers();
  protectAdvancedAPIs();
  injectFrameProtection();

  let lastURL = location.href;
  setInterval(() => {
    if (location.href !== lastURL) {
      lastURL = location.href;
      overrideVisibility();
      blockTrackingEvents();
    }
  }, 1000);
})();
