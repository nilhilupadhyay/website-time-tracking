// Check if already injected
if (!window.ttTimerInjected) {
  window.ttTimerInjected = true;

  let timerElement = null;
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  // Timer state
  let timerInterval = null;
  let timeElapsed = 0; // in seconds
  let isRunning = false;

  function createTimerElement() {
    timerElement = document.createElement('div');
    timerElement.id = 'tt-floating-timer';
    
    // Position from top-right by default
    timerElement.innerHTML = `
      <div id="tt-timer-header">
        <span id="tt-timer-title">Timer</span>
        <button id="tt-close-btn" title="Close">✕</button>
      </div>
      <div id="tt-time-display">00:00:00</div>
      <div id="tt-timer-controls">
        <button id="tt-play-btn" class="tt-btn">Start</button>
        <button id="tt-reset-btn" class="tt-btn">Reset</button>
      </div>
    `;

    document.body.appendChild(timerElement);

    // Event Listeners for UI
    document.getElementById('tt-close-btn').addEventListener('click', () => {
      timerElement.style.display = 'none';
      pauseTimer();
    });

    const playBtn = document.getElementById('tt-play-btn');
    playBtn.addEventListener('click', () => {
      if (isRunning) {
        pauseTimer();
        playBtn.textContent = 'Start';
        playBtn.classList.remove('tt-active');
      } else {
        startTimer();
        playBtn.textContent = 'Pause';
        playBtn.classList.add('tt-active');
      }
    });

    document.getElementById('tt-reset-btn').addEventListener('click', () => {
      resetTimer();
      if (!isRunning) {
        playBtn.textContent = 'Start';
        playBtn.classList.remove('tt-active');
      }
    });

    // Dragging Logic
    timerElement.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
  }

  function formatTimeDisplay(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  function updateDisplay() {
    const display = document.getElementById('tt-time-display');
    if (display) {
      display.textContent = formatTimeDisplay(timeElapsed);
    }
  }

  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      timerInterval = setInterval(() => {
        timeElapsed++;
        updateDisplay();
      }, 1000);
    }
  }

  function pauseTimer() {
    if (isRunning) {
      isRunning = false;
      clearInterval(timerInterval);
    }
  }

  function resetTimer() {
    timeElapsed = 0;
    updateDisplay();
  }

  // Drag functions
  function dragStart(e) {
    // Don't drag if clicking buttons
    if (e.target.tagName.toLowerCase() === 'button') return;

    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === timerElement || timerElement.contains(e.target)) {
      isDragging = true;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, timerElement);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleTimer') {
      if (!timerElement) {
        createTimerElement();
      } else {
        if (timerElement.style.display === 'none') {
          timerElement.style.display = 'flex';
        } else {
          timerElement.style.display = 'none';
        }
      }
      sendResponse({ status: "success" });
    }
  });
}
