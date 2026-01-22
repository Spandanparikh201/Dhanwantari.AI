require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
    if (!key) {
        console.error("No API Key found.");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    console.log(`Fetching models from: ${url.replace(key, 'HIDDEN_KEY')}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            console.error("Details:", JSON.stringify(data, null, 2));
            return;
        }

        console.log("SUCCESS! Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                    console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                }
            });
        } else {
            console.log("No models returned?", data);
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

listModels();
