// Gosuslugi and HH.RU Career Hacker Browser Extension [Free] [2.0]
// Contact the author via Telegram @DTorretto
// © 2025 Gosuslugi and HH.RU Career Hacker: Advanced Tab Tracking Blocker Browser Extension. Все права защищены.
// Official Site: https://careerhack.hitsecurity.ru

// Главная функция инициализации
const initExtension = async () => {
  // Проверка поддержки API
  if (!browser.alarms || !browser.scripting || !browser.declarativeNetRequest) {
    console.error("Critical APIs not available:", {
      alarms: !!browser.alarms,
      scripting: !!browser.scripting,
      declarativeNetRequest: !!browser.declarativeNetRequest
    });
    return;
  }

  // Блокировка tracking-скриптов
  try {
    await browser.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 1,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "||tracking.js",
            resourceTypes: ["script"]
          }
        },
        {
          id: 2,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "||analytics.js",
            resourceTypes: ["script"]
          }
        },
        {
          id: 3,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "||monitoring.js",
            resourceTypes: ["script"]
          }
        }  
      ],
      removeRuleIds: [1, 2, 3]
    });
  } catch (e) {
    console.error("Failed to block tracking scripts:", e);
  }

  // Динамическая инъекция
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "inject" && sender.tab?.id) {
      browser.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ['content-script.js']
      }).catch(e => console.warn("Injection failed:", e));
    }
  });

  // Таймеры обновления
  browser.alarms.create('refresh', { periodInMinutes: 0.08 });
  browser.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'refresh') {
      browser.tabs.query({}).then(tabs => {
        tabs.forEach(tab => {
          if (tab.id) {
            browser.scripting.executeScript({
              target: { tabId: tab.id },
              func: () => {
                if (!window.__antiTrackInitialized) {
                  window.__antiTrackInitialized = true;
                }
              }
            }).catch(e => console.warn(`Tab ${tab.id} update failed:`, e));
          }
        });
      });
    }
  });
};

// Запуск инициализации
initExtension().catch(e => console.error("Extension init failed:", e));
