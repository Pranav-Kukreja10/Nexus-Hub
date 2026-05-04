# Nexus Hub

**Nexus Hub** is a beautifully designed, highly functional browser extension that replaces your default new tab page with a smart, customizable dashboard. It brings together your essential tools, daily tasks, and productivity widgets into one sleek, glassmorphic interface.

## 🚀 Features

- **Dynamic Search Bar**: Quickly search the web using your preferred search engine (Google, Bing, DuckDuckGo, YouTube).
- **Productivity Widgets**:
  - **Focus Timer**: A built-in customizable timer to keep your workflow on track.
  - **Daily Tasks**: A persistent to-do list to track your goals for the day.
  - **Schedule**: View your schedule at a glance.
  - **Quick Note**: A simple scratchpad for jotting down instant thoughts.
- **Utility Widgets**:
  - **Live Weather & Clock**: Real-time clock and weather widget.
  - **Currency Converter**: Quick conversions with live updates.
  - **Web Screen Time**: Keep track of your browsing habits.
- **Quick Access Hubs**:
  - **Sidebar Links**: Fast access to your most-used sites (GitHub, YouTube, Meet, Reddit).
  - **Google Workspace**: One-click access to Docs, Drive, Gmail, and Calendar.
  - **AI Tools Dock**: Instantly launch top AI assistants like DeepSeek, Claude 3, Gemini Pro, and ChatGPT.
- **Extensive Customization**:
  - Choose from multiple hand-crafted themes (Dark, Cosmic, Aurora, Ocean, Sunset, Neon, Midnight, Hacker).
  - Set your own custom background and accent colors via the Theme Dock.
- **Inspirational Quotes**: Stay motivated with daily quotes.

## 🛠️ Technologies Used

- **HTML5**: For semantic structuring of the dashboard.
- **CSS3 (Vanilla)**: For styling, layout (Grid & Flexbox), and implementing a modern aesthetic.
- **JavaScript (Vanilla)**: For widget functionality, state management, and DOM manipulation.
- **Chrome Extension API**: For overriding the new tab page and handling local storage.

## 📦 Installation

Since Nexus Hub is a custom browser extension, you can install it manually in Chrome (or any Chromium-based browser like Edge, Brave, or Vivaldi):

1. Clone or download this repository to your local machine.
2. Open your browser and navigate to the Extensions page:
   - Chrome/Brave: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable **Developer mode** (usually a toggle in the top right corner).
4. Click on the **Load unpacked** button.
5. Select the `Nexus-Hub` directory containing the `manifest.json` file.
6. Open a new tab and enjoy your new Nexus Hub dashboard!

## 📁 Project Structure

```text
Nexus-Hub/
├── index.html       # The main layout and structure of the dashboard
├── style.css        # All styling, animations, and theme variables
├── script.js        # Core logic for widgets, tasks, timer, and themes
├── background.js    # Service worker for background processes like screen time
├── manifest.json    # Extension configuration file
└── README.md        # Project documentation
```

## 🎨 Themes & Customization

Click the **Palette icon** in the bottom right corner to open the Theme Dock. You can hover over the swatches to live-preview different themes, or use the custom color pickers to define your own personalized workspace.