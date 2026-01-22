require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testKey() {
    const key = process.env.GEMINI_API_KEY;
    console.log("--- API Key Diagnostic ---");

    if (!key) {
        console.error("ERROR: No GEMINI_API_KEY found in process.env");
        return;
    }

    console.log(`Key Found: YES`);
    console.log(`Length: ${key.length}`);
    console.log(`First 4: '${key.substring(0, 4)}'`);
    console.log(`Last 4:  '${key.substring(key.length - 4)}'`);

    // Check for invisible characters
    const safeKey = key.trim();
    if (safeKey.length !== key.length) {
        console.warn(`WARNING: Key has whitespace! Original: ${key.length}, Trimmed: ${safeKey.length}`);
    }

    console.log("\nAttempting to LIST MODELS...");
    try {
        const genAI = new GoogleGenerativeAI(safeKey);
        console.log("Client initialized. Trying 'gemini-2.0-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello");
        console.log("SUCCESS with 'gemini-pro'!");
        console.log(await result.response.text());
    } catch (error) {
        console.error("\nCONNECTION FAILED:");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
    }
}

testKey();
