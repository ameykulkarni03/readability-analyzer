let analysisResults = {}; // Object to store analysis results

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "storeResults") {
        // Store results from content script
        analysisResults[sender.tab.id] = request.data;
        sendResponse({status: "success"});
    } else if (request.action === "getResults") {
        // Send stored results to popup
        sendResponse(analysisResults[sender.tab.id] || {});
    }
});

// Listener for when a tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        // Clear results for the updated tab
        delete analysisResults[tabId];
    }
});
