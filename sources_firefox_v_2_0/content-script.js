// Gosuslugi and HH.RU Career Hacker Browser Extension [Free] [2.0]
// Contact the author via Telegram @DTorretto
// © 2025 Gosuslugi and HH.RU Career Hacker: Advanced Tab Tracking Blocker Browser Extension. Все права защищены.
// Official Site: https://careerhack.hitsecurity.ru

// Возможность копипасты в тестах с практическими заданиями с редактором кода (экспериментальная функция)
function enableCodeCopyPaste() {
  try {
    // Удаляем блокирующие обработчики
    document.querySelectorAll('*').forEach(el => {
      el.oncopy = el.onpaste = el.oncut = null;
    });

    // Разрешаем выделение текста
    const style = document.createElement('style');
    style.textContent = `
      * {
        user-select: text !important;
        -moz-user-select: text !important;
        -webkit-user-select: text !important;
      }
      .monaco-editor, .view-lines, .inputarea {
        user-select: text !important;
        -moz-user-select: text !important;
        -webkit-user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // Перехватываем события
    const stopEvent = e => {
      e.stopImmediatePropagation();
      e.stopPropagation();
    };
    document.addEventListener('copy', stopEvent, true);
    document.addEventListener('paste', stopEvent, true);
    document.addEventListener('cut', stopEvent, true);
    
    // Специальная обработка для редактора кода HH.ru
    if (window.location.hostname.includes('hh.ru') && 
        window.location.pathname.includes('/code/')) {
      const forceEnableEditor = () => {
        const editor = document.querySelector('.monaco-editor, .code-editor, [role="textbox"]');
        if (editor) {
          editor.style.userSelect = 'text';
          editor.contentEditable = true;
        }
      };
      forceEnableEditor();
      setInterval(forceEnableEditor, 1000);
    }
  } catch(e) {
    console.error('CopyPaste enable error:', e);
  }
}

const overrideAPI = () => {
  // Стандартные свойства видимости
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
  
  // Все возможные варианты свойств видимости
  override(document, 'hidden', false);
  override(document, 'visibilityState', 'visible');
  override(document, 'webkitHidden', false);
  override(document, 'webkitVisibilityState', 'visible');
  override(document, 'msHidden', false);
  override(document, 'msVisibilityState', 'visible');
  // Contact the author via Telegram @DTorretto
  // Дополнительные специфичные свойства для Chrome
  override(document, 'onvisibilitychange', null);
  override(window, 'onfocus', null);
  override(window, 'onblur', null);
};

// Блокировка событий
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

// Перехват таймеров
const interceptTimers = () => {
  const originalSI = window.setInterval;
  const originalST = window.setTimeout;
  // Contact the author via Telegram @DTorretto
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

// Блокировка requestIdleCallback
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

const blockUserActivityEvents = () => {
  const block = e => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    return false;
  };
  const events = [
    'pointermove', 'pointerdown', 'pointerup', 'pointerleave',
    'mousemove', 'mousedown', 'mouseup', 'mouseleave',
    'keydown', 'keyup', 'keypress',
    'visibilitychange', 'webkitvisibilitychange', 'msvisibilitychange',
    'focus', 'blur', 'focusin', 'focusout', 'pagehide', 'pageshow'
  ];
  events.forEach(ev => {
    window.addEventListener(ev, block, true);
    document.addEventListener(ev, block, true);
  });
};

const overrideComms = () => {
  // WebSocket
  if (window.WebSocket) {
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(...args) {
      const ws = new OriginalWebSocket(...args);
      ws.addEventListener('message', e => {
        // Можно фильтровать сообщения, если нужно
      });
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
};

// Инициализация
overrideAPI();
blockEvents();
interceptTimers();
blockIdleCallbacks();
blockUserActivityEvents();
overrideComms();

// Инъекция в iframe
const injectToIFrames = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
};

injectToIFrames();


// Обработчик для включения копирования/вставки
if (document.readyState === 'complete') {
  enableCodeCopyPaste();
} else {
  window.addEventListener('load', enableCodeCopyPaste);
}

// Также обрабатываем динамические изменения
new MutationObserver(() => {
  if (window.location.hostname.includes('hh.ru')) {
    enableCodeCopyPaste();
  }
}).observe(document.body, {
  childList: true,
  subtree: true
});
