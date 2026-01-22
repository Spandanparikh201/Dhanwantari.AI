const DatabaseService = require('../services/DatabaseService');

exports.getHistory = async (req, res) => {
    try {
        const history = await DatabaseService.getHistory();
        res.json(history);
    } catch (error) {
        console.error("History Error:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
};

exports.saveConsultation = async (req, res) => {
    try {
        const { summary, messages, remedy } = req.body;
        const result = await DatabaseService.saveConsultation({ summary, messages, remedy });
        res.json(result);
    } catch (error) {
        console.error("Save Error:", error);
        res.status(500).json({ error: "Failed to save consultation" });
    }
};
