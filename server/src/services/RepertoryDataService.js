const fs = require('fs');
const path = require('path');

class RepertoryDataService {
    constructor() {
        this.symptoms = [];
        this.remedies = new Map();
        this.symptomRemedyMap = new Map(); // symptom -> [{ remedy, potency, grade, disease }]
        this.loaded = false;
    }

    async loadData() {
        if (this.loaded) return;

        const csvPath = path.join(__dirname, '../data/homeopathy_data.csv');

        try {
            const content = fs.readFileSync(csvPath, 'utf-8');
            const lines = content.trim().split('\n');

            // Skip header
            const header = lines[0];
            const dataLines = lines.slice(1);

            const symptomSet = new Set();
            let symptomId = 0;

            dataLines.forEach((line, index) => {
                // Parse CSV line (handling quoted values)
                const matches = line.match(/("([^"]*)"|[^,]+)/g);
                if (!matches || matches.length < 5) return;

                const symptom = matches[0].replace(/"/g, '').trim();
                const disease = matches[1].replace(/"/g, '').trim();
                const remedy = matches[2].replace(/"/g, '').trim();
                const potency = matches[3].replace(/"/g, '').trim();
                const grade = parseInt(matches[4].replace(/"/g, '').trim()) || 1;

                // Add symptom if new
                if (!symptomSet.has(symptom)) {
                    symptomSet.add(symptom);
                    symptomId++;
                    this.symptoms.push({
                        id: `s${symptomId}`,
                        name: symptom,
                        category: this.extractCategory(symptom),
                        disease: disease
                    });
                }

                // Add remedy to set
                if (!this.remedies.has(remedy)) {
                    this.remedies.set(remedy, {
                        id: `r${this.remedies.size + 1}`,
                        name: remedy,
                        potency: potency,
                        diseases: new Set()
                    });
                }
                this.remedies.get(remedy).diseases.add(disease);

                // Map symptom to remedies
                const symptomObj = this.symptoms.find(s => s.name === symptom);
                if (symptomObj) {
                    if (!this.symptomRemedyMap.has(symptomObj.id)) {
                        this.symptomRemedyMap.set(symptomObj.id, []);
                    }
                    this.symptomRemedyMap.get(symptomObj.id).push({
                        remedyId: this.remedies.get(remedy).id,
                        remedyName: remedy,
                        potency: potency,
                        grade: grade,
                        disease: disease
                    });
                }
            });

            this.loaded = true;
            console.log(`RepertoryDataService: Loaded ${this.symptoms.length} symptoms, ${this.remedies.size} remedies`);
        } catch (error) {
            console.error('Failed to load repertory data:', error);
            throw error;
        }
    }

    extractCategory(symptom) {
        const categoryMap = {
            'Headache': 'Head',
            'Fever': 'Generalities',
            'Cough': 'Chest',
            'Anxiety': 'Mind',
            'Stomach': 'Stomach',
            'Joint': 'Extremities',
            'Skin': 'Skin',
            'Sleep': 'Sleep',
            'Throat': 'Throat',
            'Eyes': 'Eyes',
            'Nose': 'Nose',
            'Ear': 'Ears',
            'Back': 'Back',
            'Digestion': 'Abdomen',
            'Mind': 'Mind',
            'Women': 'Female',
            'Children': 'Pediatric',
            'Respiratory': 'Chest',
            'Urinary': 'Bladder',
            'Heart': 'Heart',
            'Nerves': 'Nerves',
            'Allergy': 'Generalities',
            'Trauma': 'Generalities'
        };

        for (const [key, value] of Object.entries(categoryMap)) {
            if (symptom.startsWith(key)) return value;
        }
        return 'Generalities';
    }

    searchSymptoms(query) {
        if (!query || query.length < 2) return [];

        const lowerQuery = query.toLowerCase();
        return this.symptoms
            .filter(s => s.name.toLowerCase().includes(lowerQuery))
            .slice(0, 15); // Limit results
    }

    analyzeSymptoms(symptomIds) {
        const scores = new Map(); // remedyId -> { remedy, score, matchedSymptoms, diseases }

        symptomIds.forEach(sId => {
            const entries = this.symptomRemedyMap.get(sId) || [];
            entries.forEach(entry => {
                if (!scores.has(entry.remedyId)) {
                    scores.set(entry.remedyId, {
                        remedy: {
                            id: entry.remedyId,
                            name: entry.remedyName,
                            potency: entry.potency
                        },
                        score: 0,
                        coveredSymptoms: [],
                        diseases: new Set()
                    });
                }

                const current = scores.get(entry.remedyId);
                current.score += entry.grade;
                current.coveredSymptoms.push(sId);
                current.diseases.add(entry.disease);
            });
        });

        // Convert to array, sort by score, and format
        return Array.from(scores.values())
            .map(item => ({
                remedy: item.remedy,
                score: item.score,
                coveredSymptoms: item.coveredSymptoms,
                diseases: Array.from(item.diseases)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Top 10 remedies
    }

    getAllSymptoms() {
        return this.symptoms;
    }

    getAllRemedies() {
        return Array.from(this.remedies.values()).map(r => ({
            id: r.id,
            name: r.name,
            potency: r.potency,
            diseases: Array.from(r.diseases)
        }));
    }
}

// Singleton instance
const repertoryDataService = new RepertoryDataService();

module.exports = repertoryDataService;
