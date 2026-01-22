const AIProviderFactory = require('./ai/AIProviderFactory');

const SYSTEM_PROMPT = require('../config/systemPrompt');

class HomeopathyEngine {
    constructor() {
        this.aiProvider = AIProviderFactory.createProvider();
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            await this.aiProvider.initialize();
            this.initialized = true;
        }
    }

    async processMessage(history) {
        if (!this.initialized) {
            await this.initialize();
        }

        // Safety Layer (Basic keyword check before sending to LLM for speed)
        const lastMsg = history[history.length - 1].content.toLowerCase();
        const emergencies = ['heart attack', 'suicide', 'chest pain', 'unconscious', 'bleeding heavily'];
        if (emergencies.some(e => lastMsg.includes(e))) {
            return "🚨 **EMERGENCY WARNING**: This sounds like a medical emergency. Please stop using this app and call emergency services immediately. I cannot assist with life-threatening situations.";
        }

        const rawResponse = await this.aiProvider.generateResponse(history, SYSTEM_PROMPT);

        // Attempt to extract JSON block
        const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/);

        let content = rawResponse;
        let prescription = null;

        if (jsonMatch) {
            try {
                prescription = JSON.parse(jsonMatch[1]);
                // Remove the JSON block from the visible content
                content = rawResponse.replace(jsonMatch[0], '').trim();
            } catch (e) {
                console.error("Failed to parse prescription JSON:", e);
            }
        }

        return { content, prescription };
    }
}

module.exports = new HomeopathyEngine();
