# Time Tracker & Floating Timer Extension

A Google Chrome extension designed to help you monitor the time you spend on different websites while offering a versatile, draggable floating timer for focused work sessions.

## 🚀 Features

- **Automated Time Tracking**: Seamlessly records the time you spend on various domains in the background. It pauses automatically when you switch tabs or minimize the window.
- **Insights Dashboard**: A clean popup interface that displays your total browsing time for the day and a ranked list of your most visited websites along with their favicons.
- **Draggable Floating Timer**: A built-in stopwatch timer that you can overlay on top of any webpage. It features Start, Pause, and Reset controls, and you can drag it anywhere on the screen so it never blocks your content.

## 🛠️ Tech Stack

- **HTML/CSS/JavaScript**: Vanilla web technologies for the frontend UI.
- **Chrome Extensions API (Manifest V3)**:
  - `Service Workers` (`background.js`) for persistent time tracking.
  - `Chrome Storage API` (`chrome.storage.local`) for saving time data locally.
  - `Content Scripts` for injecting the draggable floating timer into web pages.
  - `Tabs API` for tracking active tabs and sending messages between the popup and content scripts.

## 📥 Installation

Since this extension is not currently published on the Chrome Web Store, you can install it manually:

1. **Clone the repository** or download the ZIP file and extract it.
   ```bash
   git clone https://github.com/nilhilupadhyay/website-time-tracking.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button that appears in the top left.
5. Select the folder containing the extension files (`website-time-tracking`).
6. Click the puzzle piece icon 🧩 in Chrome's top right toolbar and "Pin" the **Time Tracker & Floating Timer** extension so it's always accessible.

## 💡 How to Use

1. **Track Time**: Simply browse the web as you normally would. The extension works in the background.
2. **View Stats**: Click the pinned extension icon to view your daily statistics.
3. **Toggle Floating Timer**: While on any webpage, open the extension popup and click the small "⏱️" icon in the header. The draggable timer will appear on your current page.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
