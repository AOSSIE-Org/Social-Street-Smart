let currentDomain = '';
let startTime = Date.now();

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  updateTimeForDomain(tab.url);
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateTimeForDomain(tab.url);
  }
});

function updateTimeForDomain(url: string | undefined) {
  if (!url) return;
  const now = Date.now();
  const domain = new URL(url).hostname;
  
  if (currentDomain) {
    const timeSpent = now - startTime;
    chrome.storage.local.get(currentDomain, (result) => {
      const currentTime = result[currentDomain] || 0;
      chrome.storage.local.set({ [currentDomain]: currentTime + timeSpent });
    });
  }
  currentDomain = domain;
  startTime = now;
}
