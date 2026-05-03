// Helper function to extract just the domain
function getDomain(url) {
    if (!url || !url.startsWith("http")) return null;
    let urlObj = new URL(url);
    return urlObj.hostname.replace("www.", ""); 
}

// The new save function relies on Chrome's hard drive, NOT short-term memory
function saveTime(newDomain) {
    // Grab the tracker's memory notes AND the daily tallies
    chrome.storage.local.get(["trackingState", "screenTime"], function(result) {
        let state = result.trackingState || {};
        let allData = result.screenTime || {};
        let today = new Date().toDateString();

        // 1. If we were tracking a website before we fell asleep, calculate the time!
        if (state.domain && state.startTime) {
            let timeSpent = Date.now() - state.startTime;
            
            if (!allData[today]) allData[today] = {};
            if (!allData[today][state.domain]) allData[today][state.domain] = 0;
            
            allData[today][state.domain] += timeSpent;
        }

        // 2. Start tracking the NEW website you just clicked on
        state.domain = newDomain;
        state.startTime = Date.now();

        // 3. Save the new tally AND the new memory notes back to the hard drive
        chrome.storage.local.set({ 
            screenTime: allData, 
            trackingState: state 
        });
    });
}

// Event 1: Switching Tabs
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        // If the tab is fully loaded, get the URL
        if (tab.url) {
            saveTime(getDomain(tab.url));
        }
    });
});

// Event 2: Typing a new URL into the current tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        // Check if the tab that updated is the one you are actually looking at
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0 && tabs[0].id === tabId) {
                saveTime(getDomain(changeInfo.url));
            }
        });
    }
});

// Event 3: Minimizing Chrome or switching to another desktop app
chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // You clicked away from Chrome, so pass 'null' to stop the clock
        saveTime(null); 
    } else {
        // You came back to Chrome, so start the clock for whatever tab is open
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                saveTime(getDomain(tabs[0].url));
            }
        });
    }
});