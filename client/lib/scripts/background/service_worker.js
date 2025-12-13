chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "reportHSMenu",
        title: "Analyze with Social Street Smart AI",  // <--- CHANGED HERE
        contexts: ["selection"]
    });
});

async function setupOffscreenDocument(path) {
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [path]
    });
    if (existingContexts.length > 0) return;

    await chrome.offscreen.createDocument({
        url: path,
        reasons: ["WORKERS"],
        justification: "AI Inference"
    });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "AI_PROGRESS") {
        chrome.notifications.update("ai_loading", {
            message: message.status,
            priority: 0
        });
    }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "reportHSMenu" && info.selectionText) {
        
        // Notification Title Changed HERE
        chrome.notifications.create("ai_loading", {
            type: "basic",
            iconUrl: "../../assets/icon/72.png",
            title: "Social Street Smart AI", 
            message: "Waking up..."
        });

        try {
            await setupOffscreenDocument("offscreen.html");

            chrome.runtime.sendMessage({ 
                action: "ANALYZE_TEXT", 
                text: info.selectionText 
            }, (response) => {
                
                chrome.notifications.clear("ai_loading");
                
                if (chrome.runtime.lastError) {
                    chrome.notifications.create("ai_error", {
                        type: "basic",
                        iconUrl: "../../assets/icon/72.png",
                        title: "Connection Error",
                        message: "Could not reach the AI."
                    });
                } else if (response && response.verdict) {
                    chrome.notifications.create("ai_result", {
                        type: "basic",
                        iconUrl: "../../assets/icon/72.png",
                        title: "AI Verdict",
                        message: "Result: " + response.verdict,
                        priority: 2
                    });
                }
            });

        } catch (err) {
            console.error(err);
        }
    }
});
