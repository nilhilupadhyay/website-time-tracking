let activeTabId = null;
let activeWindowId = null;
let lastUpdateTime = Date.now();
let currentDomain = null;

// Track time spent
async function updateTime() {
  if (currentDomain) {
    const now = Date.now();
    const timeSpent = now - lastUpdateTime;
    lastUpdateTime = now;

    // Save to storage
    const data = await chrome.storage.local.get(['siteTimes']);
    const siteTimes = data.siteTimes || {};
    
    siteTimes[currentDomain] = (siteTimes[currentDomain] || 0) + timeSpent;
    await chrome.storage.local.set({ siteTimes });
  }
}

// Extract domain from URL
function getDomain(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return urlObj.hostname;
    }
  } catch (e) {}
  return null;
}

// Listen for tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateTime();
  activeTabId = activeInfo.tabId;
  activeWindowId = activeInfo.windowId;
  
  try {
    const tab = await chrome.tabs.get(activeTabId);
    currentDomain = getDomain(tab.url);
  } catch (e) {
    currentDomain = null;
  }
  lastUpdateTime = Date.now();
});

// Listen for URL changes in the active tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    await updateTime();
    currentDomain = getDomain(changeInfo.url);
    lastUpdateTime = Date.now();
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await updateTime();
    currentDomain = null;
  } else {
    activeWindowId = windowId;
    try {
      const tabs = await chrome.tabs.query({ active: true, windowId: activeWindowId });
      if (tabs.length > 0) {
        activeTabId = tabs[0].id;
        currentDomain = getDomain(tabs[0].url);
        lastUpdateTime = Date.now();
      }
    } catch (e) {
      currentDomain = null;
    }
  }
});

// Update periodically to prevent losing time if browser crashes or tab is kept open long
setInterval(updateTime, 5000);
