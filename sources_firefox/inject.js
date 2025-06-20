// Gosuslugi and HH.RU Career Hacker Browser Extension [1.1]
// Contact the author via Telegram @Zevs_AV or @DTorretto
// © 2025 Gosuslugi and HH.RU Career Hacker: Advanced Tab Tracking Blocker Browser Extension. Все права защищены.
// Official Site: https://careerhack.hitsecurity.ru
(function() {
  try {

    Object.defineProperty(document, 'hidden', { 
      get: () => false,
      configurable: false
    });
    Object.defineProperty(document, 'visibilityState', {
      get: () => 'visible',
      configurable: false
    });

    const block = e => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      return false;
    };
    // Contact the author via Telegram @Zevs_AV or @DTorretto
    ['focus', 'blur', 'visibilitychange'].forEach(ev => {
      window.addEventListener(ev, block, true);
      document.addEventListener(ev, block, true);
    });

    if (typeof document.mozHidden !== 'undefined') {
      Object.defineProperty(document, 'mozHidden', {
        get: () => false,
        configurable: false
      });
    }
  } catch(e) {
    console.error('AntiTrack iframe error:', e);
  }
})();
