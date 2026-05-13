function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

function formatTotalTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

async function renderData() {
  const data = await chrome.storage.local.get(['siteTimes']);
  const siteTimes = data.siteTimes || {};
  
  const sitesList = document.getElementById('sites-list');
  const totalTimeDisplay = document.getElementById('total-time-display');
  
  sitesList.innerHTML = '';
  let totalTime = 0;
  
  const sortedSites = Object.entries(siteTimes)
    .sort((a, b) => b[1] - a[1])
    .filter(([domain, time]) => time > 1000 && domain !== 'null'); // only show if more than 1s

  for (const [domain, time] of sortedSites) {
    totalTime += time;
    
    const li = document.createElement('li');
    
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    li.innerHTML = `
      <div class="site-info">
        <img src="${faviconUrl}" class="favicon" alt="${domain}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PGxpbmUgeDE9IjIiIHkxPSIxMiIgeDI9IjIyIiB5MT0iMTIiPjwvbGluZT48cGF0aCBkPSJNMTIgMmExNS4zIDE1LjMgMCAwIDEgNCAxMGMtMS42IDUuMy00IDEwLTQgMTBzLTIuNC00LjctNC0xMGMxLjYtNS4zIDQtMTAgNC0xMHoiPjwvcGF0aD48L3N2Zz4='">
        <span class="domain" title="${domain}">${domain}</span>
      </div>
      <span class="time">${formatTime(time)}</span>
    `;
    sitesList.appendChild(li);
  }
  
  totalTimeDisplay.textContent = formatTotalTime(totalTime);
  
  if (sortedSites.length === 0) {
    sitesList.innerHTML = '<li style="justify-content: center; color: var(--text-secondary);">No data yet</li>';
  }
}

// Initial render
renderData();

// Update every second while popup is open to keep it live
setInterval(renderData, 1000);

// Timer Toggle Logic
document.getElementById('toggle-timer-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    // Send message to content script to toggle the timer
    chrome.tabs.sendMessage(tab.id, { action: 'toggleTimer' }).catch(() => {
      // If content script is not injected yet
      alert("Cannot inject timer on this page. Try refreshing the page or using it on a regular website.");
    });
  }
});
