
const repertoryDataService = require('../services/RepertoryDataService');

// Initialize data on first load
let initialized = false;
const ensureInitialized = async () => {
    if (!initialized) {
        await repertoryDataService.loadData();
        initialized = true;
    }
};

const searchSymptoms = async (req, res) => {
    try {
        await ensureInitialized();

        const { q } = req.query;
        if (!q) return res.json([]);

        const results = repertoryDataService.searchSymptoms(q);
        res.json(results);
    } catch (error) {
        console.error('Search symptoms error:', error);
        res.status(500).json({ message: 'Failed to search symptoms' });
    }
};

const analyzeRemedies = async (req, res) => {
    try {
        await ensureInitialized();

        const { symptomIds } = req.body;
        if (!symptomIds || !Array.isArray(symptomIds)) {
            return res.status(400).json({ message: "Invalid symptomIds" });
        }

        const results = repertoryDataService.analyzeSymptoms(symptomIds);
        res.json(results);
    } catch (error) {
        console.error('Analyze remedies error:', error);
        res.status(500).json({ message: 'Failed to analyze remedies' });
    }
};

const getAllSymptoms = async (req, res) => {
    try {
        await ensureInitialized();
        res.json(repertoryDataService.getAllSymptoms());
    } catch (error) {
        console.error('Get all symptoms error:', error);
        res.status(500).json({ message: 'Failed to get symptoms' });
    }
};

const getAllRemedies = async (req, res) => {
    try {
        await ensureInitialized();
        res.json(repertoryDataService.getAllRemedies());
    } catch (error) {
        console.error('Get all remedies error:', error);
        res.status(500).json({ message: 'Failed to get remedies' });
    }
};

module.exports = { searchSymptoms, analyzeRemedies, getAllSymptoms, getAllRemedies };
