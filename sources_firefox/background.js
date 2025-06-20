// Gosuslugi and HH.RU Career Hacker Browser Extension [1.1]
// Contact the author via Telegram @Zevs_AV or @DTorretto
// © 2025 Gosuslugi and HH.RU Career Hacker: Advanced Tab Tracking Blocker Browser Extension. Все права защищены.
// Official Site: https://careerhack.hitsecurity.ru
const TRACKING_PATTERNS = [
  "*://*/*track*",
  "*://*/*analytics*",
  "*://*/*monitor*",
  "*://*/*visib*",
  "*://*/*focus*"
];

browser.webRequest.onBeforeRequest.addListener(
  details => ({ cancel: true }),
  { urls: TRACKING_PATTERNS, types: ["script"] },
  ["blocking"]
);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Contact the author via Telegram @Zevs_AV or @DTorretto
  if (changeInfo.status === 'complete') {
    browser.tabs.executeScript(tabId, {
      file: 'content-script.js',
      runAt: 'document_start',
      allFrames: true
    }).catch(() => {});
  }
});

browser.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    browser.storage.local.set({ installed: true });
  }
  // Contact the author via Telegram @Zevs_AV or @DTorretto
  console.log('Extension initialized:', details.reason);
});

browser.webRequest.onBeforeRequest.addListener(
  details => {
    if (details.url.includes('worker.js') || 
        details.url.includes('service-worker.js')) {
      return { cancel: true };
    }
    return {};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'inject') {
    browser.tabs.executeScript(sender.tab.id, {
      file: 'content-script.js',
      allFrames: true,
      runAt: 'document_start'
    }).then(sendResponse);
    return true;
  }
});
