/**
 * Abstract Base Class for AI Providers
 * Enforces the contract for both Gemini and Ollama implementations.
 */
class AIProvider {
    constructor() {
        if (this.constructor === AIProvider) {
            throw new Error("Cannot instantiate abstract class AIProvider");
        }
    }

    /**
     * Initialize the provider (auth, model loading)
     */
    async initialize() {
        throw new Error("Method 'initialize()' must be implemented.");
    }

    /**
     * Generate a response based on chat history
     * @param {Array} history - Array of { role: 'user'|'model', content: string }
     * @returns {Promise<string>}
     */
    async generateResponse(history) {
        throw new Error("Method 'generateResponse()' must be implemented.");
    }
}

module.exports = AIProvider;
