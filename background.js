
function getDomain(url) {
    if (!url || !url.startsWith("http")) return null;
    let urlObj = new URL(url);
    return urlObj.hostname.replace("www.", ""); 
}


function saveTime(newDomain) {
   
    chrome.storage.local.get(["trackingState", "screenTime"], function(result) {
        let state = result.trackingState || {};
        let allData = result.screenTime || {};
        let today = new Date().toDateString();

      
        if (state.domain && state.startTime) {
            let timeSpent = Date.now() - state.startTime;
            
            if (!allData[today]) allData[today] = {};
            if (!allData[today][state.domain]) allData[today][state.domain] = 0;
            
            allData[today][state.domain] += timeSpent;
        }

    
        state.domain = newDomain;
        state.startTime = Date.now();

        chrome.storage.local.set({ 
            screenTime: allData, 
            trackingState: state 
        });
    });
}


chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        URL
        if (tab.url) {
            saveTime(getDomain(tab.url));
        }
    });
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0 && tabs[0].id === tabId) {
                saveTime(getDomain(changeInfo.url));
            }
        });
    }
});


chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        saveTime(null); 
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                saveTime(getDomain(tabs[0].url));
            }
        });
    }
});