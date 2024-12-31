// Tab Listener

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        // Store the URL of the updated tab in chrome storage
        chrome.storage.local.set({ 'activeTabUrl': changeInfo.url });
    }
});

// Listen for tab activation (when a user switches tabs)
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        // Store the active tab's URL
        chrome.storage.local.set({ 'activeTabUrl': tab.url });
    });
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "getActiveTabUrl") {
        // Retrieve the active tab URL from chrome storage
        chrome.storage.local.get('activeTabUrl', function(data) {
            sendResponse({ url: data.activeTabUrl || 'No URL found' });
        });
        // Keep the message channel open for async response
        return true;
    }
});


// Listen for messages from the popup to get saved URLs
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "getVisitedUrls") {
        // Retrieve the list of visited URLs from chrome.storage
        chrome.storage.local.get('visitedUrls', function(data) {
            sendResponse({ urls: data.visitedUrls || [] });
        });
        return true; // Keep the message channel open for async response
    }
});

// Url Listener
// Function to save the URL in chrome.storage.local
function saveUrl(url) {
    chrome.storage.local.get({ visitedUrls: [] }, function(result) {
        let visitedUrls = result.visitedUrls;

        // Ensure no duplicate URLs are stored
        if (!visitedUrls.includes(url)) {
            visitedUrls.push(url); // Add the new URL to the list
            chrome.storage.local.set({ visitedUrls: visitedUrls });
        }
    });
}

// Listen for messages from content scripts (e.g., when a link is clicked)
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "saveClickedUrl") {
        const clickedUrl = message.url;
        console.log("Saving clicked URL:", clickedUrl);  // Log for debugging
        saveUrl(clickedUrl);
    }

    // Send the list of saved URLs to the popup when requested
    if (message.action === "getVisitedUrls") {
        chrome.storage.local.get('visitedUrls', function(data) {
            sendResponse({ urls: data.visitedUrls || [] });
        });
        return true; // Keep the message channel open for async response
    }
});



