const GeminiProvider = require('./GeminiProvider');
const OllamaProvider = require('./OllamaProvider');

class AIProviderFactory {
    static createProvider() {
        const providerType = process.env.AI_PROVIDER || 'GEMINI';

        console.log(`Initializing AI Provider: ${providerType}`);

        const apiKey = process.env.GEMINI_API_KEY;
        console.log(`Debug - Loaded API Key: ${apiKey ? 'Yes' : 'No'}`);
        if (apiKey) console.log(`Debug - Key Length: ${apiKey.length}, Starts with: ${apiKey.substring(0, 4)}`);

        if (providerType === 'OLLAMA') {
            return new OllamaProvider(
                process.env.OLLAMA_BASE_URL,
                process.env.OLLAMA_MODEL
            );
        } else {
            return new GeminiProvider(process.env.GEMINI_API_KEY);
        }
    }
}

module.exports = AIProviderFactory;
