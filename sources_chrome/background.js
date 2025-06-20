// Gosuslugi and HH.RU Career Hacker Browser Extension [1.1]
// Contact the author via Telegram @Zevs_AV or @DTorretto
// © 2025 Gosuslugi and HH.RU Career Hacker: Advanced Tab Tracking Blocker Browser Extension. Все права защищены.
// Official Site: https://careerhack.hitsecurity.ru
const blockPatterns = [
  '*://*/*tracking.js',
  '*://*/*analytics.js',
  '*://*/*monitoring.js'
];

chrome.webRequest.onBeforeRequest.addListener(
  () => ({ cancel: true }),
  { urls: blockPatterns },
  ["blocking"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "inject") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ['content-script.js']
    // Contact the author via Telegram @Zevs_AV or @DTorretto	  
    }).catch(console.warn);
  }
});

chrome.alarms.create('refresh', { periodInMinutes: 0.08 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'refresh') {
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
		  // Contact the author via Telegram @Zevs_AV or @DTorretto
          func: () => {
            if (!window.__antiTrackInitialized) {
              window.__antiTrackInitialized = true;
            }
          }
        });
      });
    });
  }
});
