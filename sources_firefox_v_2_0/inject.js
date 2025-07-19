// Gosuslugi and HH.RU Career Hacker Browser Extension [Free] [2.0]
// Contact the author via Telegram @DTorretto
// © 2025 Gosuslugi and HH.RU Career Hacker: Advanced Tab Tracking Blocker Browser Extension. Все права защищены.
// Official Site: https://careerhack.hitsecurity.ru
try {
  Object.defineProperty(document, 'hidden', { get: () => false });
  Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
  
  const block = e => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    return false;
  };
  
  ['focus', 'blur', 'visibilitychange', 'pointermove', 'pointerdown', 'pointerup', 'pointerleave', 'mousemove', 'mousedown', 'mouseup', 'mouseleave', 'keydown', 'keyup', 'keypress'].forEach(ev => {
    window.addEventListener(ev, block, true);
  });

  // WebSocket
  if (window.WebSocket) {
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(...args) {
      const ws = new OriginalWebSocket(...args);
      ws.addEventListener('message', e => {});
      return ws;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;
  }
  // postMessage
  const originalPostMessage = window.postMessage;
  window.postMessage = function(message, targetOrigin, transfer) {
    if (typeof message === 'string' && /(visibility|hidden|focus|blur)/i.test(message)) {
      return;
    }
    return originalPostMessage.apply(this, arguments);
  };
  // BroadcastChannel
  if (window.BroadcastChannel) {
    const OriginalBC = window.BroadcastChannel;
    window.BroadcastChannel = function(name) {
      const bc = new OriginalBC(name);
      bc.postMessage = function(message) {
        if (typeof message === 'string' && /(visibility|hidden|focus|blur)/i.test(message)) {
          return;
        }
        return OriginalBC.prototype.postMessage.apply(this, arguments);
      };
      return bc;
    };
    window.BroadcastChannel.prototype = OriginalBC.prototype;
  }
} catch(e) {
  console.error('AntiTrack iframe error:', e);
}
