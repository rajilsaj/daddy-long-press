
document.addEventListener("click", function(event) {
    if (event.target.tagName.toLowerCase() === 'a' && event.target.href) {
        const clickedUrl = event.target.href;
        console.log("Link clicked:", clickedUrl);  // Log the clicked URL for debugging

        // Send the clicked URL to the background script for saving
        chrome.runtime.sendMessage({ action: "saveClickedUrl", url: clickedUrl });
    }
});

