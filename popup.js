// Send a message to the background script to get the active tab's URL
chrome.runtime.sendMessage({ action: "getActiveTabUrl" }, function(response) {
    console.log("Active tab URL from background: ", response.url);
    //document.getElementById("url-display").textContent = response.url; // Update DOM element
});

// Optionally, if you want to handle tab updates in real-time while the popup is open:
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        console.log("Tab URL updated:", changeInfo.url);
        //document.getElementById("url-display").textContent = changeInfo.url;
    }
});

// Send a message to the background script to get the list of visited URLs
chrome.runtime.sendMessage({ action: "getVisitedUrls" }, function(response) {
    const visitedUrls = response.urls;
    console.log("Visited URLs:", visitedUrls); // Log the visited URLs for debugging
    displayUrls(visitedUrls);
});

// Function to display the visited URLs in the popup
function displayUrls(urls) {
    const urlListElement = document.getElementById("url-list");
    urlListElement.innerHTML = ''; // Clear existing list
    if (urls.length === 0) {
        urlListElement.textContent = "No URLs visited yet.";
    } else {
        urls.forEach(url => {
            const listItem = document.createElement("li");
            listItem.textContent = url;
            urlListElement.appendChild(listItem);
        });
    }
}

