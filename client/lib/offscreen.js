import { CreateMLCEngine } from "./scripts/libs/web-llm.js";

const selectedModel = "Gemma-2b-it-q4f32_1-MLC"; 
let engine = null;

async function analyze(text) {
    if (!engine) {
        console.log("Initializing Engine...");
        
        // 1. Create Engine with Progress Reporting
        engine = await CreateMLCEngine(selectedModel, {
            initProgressCallback: (info) => {
                // Send progress back to the Service Worker
                chrome.runtime.sendMessage({ 
                    action: "AI_PROGRESS", 
                    status: info.text 
                });
            }
        });
    }

    const messages = [
        { role: "system", content: "You are a content moderation AI. Reply ONLY 'HATE' or 'SAFE'." },
        { role: "user", content: text }
    ];

    const reply = await engine.chat.completions.create({ messages });
    return reply.choices[0].message.content;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "ANALYZE_TEXT") {
        analyze(request.text)
            .then(verdict => sendResponse({ verdict: verdict }))
            .catch(err => sendResponse({ error: err.message }));
        
        return true; // Keep channel open
    }
});
