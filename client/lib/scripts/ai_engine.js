// --- COMPATIBILITY PATCH ---
// The AI library needs "window" to work, but Service Workers don't have it.
// We trick it by pointing "window" to "self".
self.window = self;
self.document = { currentScript: null };
// ---------------------------

// 1. Run the library file
import "./libs/web-llm.js";

// 2. Helper to get the engine
function getEngine() {
    if (self.webllm && self.webllm.CreateMLCEngine) {
        return self.webllm.CreateMLCEngine;
    } 
    return self.CreateMLCEngine;
}

// 3. Initialize Function
let engine = null;
async function initializeAI() {
    if (engine) return; 
    console.log("Initializing Sovereign AI...");
    
    const CreateMLCEngine = getEngine();
    if (!CreateMLCEngine) throw new Error("AI Library not found.");

    // We use the exact model ID for the cached version
    const selectedModel = "Gemma-2b-it-q4f32_1-MLC"; 
    
    engine = await CreateMLCEngine(selectedModel, {
        initProgressCallback: (info) => console.log(info.text),
    });
    console.log("Sovereign AI Ready!");
}

// 4. Main Function
self.analyzeText = async function(text) {
    if (!engine) await initializeAI();

    const messages = [
        { role: "system", content: "You are a content moderation AI. Reply ONLY 'HATE' or 'SAFE'." },
        { role: "user", content: text }
    ];

    const reply = await engine.chat.completions.create({ messages });
    return reply.choices[0].message.content;
}
