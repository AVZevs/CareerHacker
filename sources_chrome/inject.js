// Gosuslugi and HH.RU Career Hacker Browser Extension [1.1]
// Contact the author via Telegram @Zevs_AV or @DTorretto
// © 2025 Gosuslugi and HH.RU Career Hacker: Advanced Tab Tracking Blocker Browser Extension. Все права защищены.
// Official Site: https://careerhack.hitsecurity.ru
try {
  Object.defineProperty(document, 'hidden', { get: () => false });
  Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
  // Contact the author via Telegram @Zevs_AV or @DTorretto  
  const block = e => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    return false;
  };
  // Contact the author via Telegram @Zevs_AV or @DTorretto
  ['focus', 'blur', 'visibilitychange'].forEach(ev => {
    window.addEventListener(ev, block, true);
  });
} catch(e) {
  console.error('AntiTrack iframe error:', e);
}
