
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testKnowledge() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.error("No Key"); return; }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const authors = [
        "William Boericke",
        "James Tyler Kent",
        "John Henry Clarke"
    ];

    console.log("--- Testing Materia Medica Knowledge ---\n");

    for (const author of authors) {
        console.log(`Testing Author: ${author}...`);
        const prompt = `Provide a verbatim quote (or as close as possible) of the first sentence describing 'Nux Vomica' from ${author}'s Materia Medica. If you don't have exact text, summarize his Keynotes for it.`;

        try {
            const result = await model.generateContent(prompt);
            console.log(`AI Response for ${author}:\n${result.response.text()}\n`);
        } catch (e) {
            console.error(`Error for ${author}:`, e.message);
        }
        console.log("-".repeat(20));
    }
}

testKnowledge();
