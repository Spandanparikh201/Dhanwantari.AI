/**
 * Repertory API Tests
 * Tests for symptom search and remedy analysis
 */

const repertoryDataService = require('../services/RepertoryDataService');

describe('Repertory Data Service', () => {
    beforeAll(async () => {
        await repertoryDataService.loadData();
    });

    describe('loadData()', () => {
        it('should load symptoms from CSV', () => {
            const symptoms = repertoryDataService.getAllSymptoms();
            expect(symptoms).toBeDefined();
            expect(Array.isArray(symptoms)).toBe(true);
            expect(symptoms.length).toBeGreaterThan(0);
        });

        it('should load remedies from CSV', () => {
            const remedies = repertoryDataService.getAllRemedies();
            expect(remedies).toBeDefined();
            expect(Array.isArray(remedies)).toBe(true);
            expect(remedies.length).toBeGreaterThan(0);
        });
    });

    describe('searchSymptoms()', () => {
        it('should find symptoms containing "headache"', () => {
            const results = repertoryDataService.searchSymptoms('headache');
            expect(results).toBeDefined();
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBeGreaterThan(0);

            // All results should contain "headache"
            results.forEach(symptom => {
                expect(symptom.name.toLowerCase()).toContain('headache');
            });
        });

        it('should return empty array for short queries', () => {
            const results = repertoryDataService.searchSymptoms('a');
            expect(results).toEqual([]);
        });

        it('should return empty array for empty query', () => {
            const results = repertoryDataService.searchSymptoms('');
            expect(results).toEqual([]);
        });

        it('should find symptoms containing "fever"', () => {
            const results = repertoryDataService.searchSymptoms('fever');
            expect(results.length).toBeGreaterThan(0);
        });

        it('should be case insensitive', () => {
            const lower = repertoryDataService.searchSymptoms('anxiety');
            const upper = repertoryDataService.searchSymptoms('ANXIETY');
            expect(lower.length).toBe(upper.length);
        });
    });

    describe('analyzeSymptoms()', () => {
        it('should return ranked remedies for symptom IDs', () => {
            const symptoms = repertoryDataService.searchSymptoms('headache');
            const symptomIds = symptoms.slice(0, 2).map(s => s.id);

            const results = repertoryDataService.analyzeSymptoms(symptomIds);

            expect(results).toBeDefined();
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBeGreaterThan(0);

            // Check structure
            const firstResult = results[0];
            expect(firstResult.remedy).toBeDefined();
            expect(firstResult.remedy.name).toBeDefined();
            expect(firstResult.score).toBeGreaterThan(0);
            expect(firstResult.coveredSymptoms).toBeDefined();
        });

        it('should return empty array for empty input', () => {
            const results = repertoryDataService.analyzeSymptoms([]);
            expect(results).toEqual([]);
        });

        it('should return results sorted by score descending', () => {
            const symptoms = repertoryDataService.searchSymptoms('headache');
            const symptomIds = symptoms.slice(0, 3).map(s => s.id);

            const results = repertoryDataService.analyzeSymptoms(symptomIds);

            for (let i = 1; i < results.length; i++) {
                expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
            }
        });

        it('should include diseases in results', () => {
            const symptoms = repertoryDataService.searchSymptoms('headache');
            const symptomIds = symptoms.slice(0, 2).map(s => s.id);

            const results = repertoryDataService.analyzeSymptoms(symptomIds);

            if (results.length > 0) {
                expect(results[0].diseases).toBeDefined();
                expect(Array.isArray(results[0].diseases)).toBe(true);
            }
        });
    });

    describe('Data Accuracy', () => {
        it('should have Belladonna for throbbing headache', () => {
            const symptoms = repertoryDataService.searchSymptoms('throbbing');
            const symptomIds = symptoms.map(s => s.id);

            const results = repertoryDataService.analyzeSymptoms(symptomIds);
            const remedyNames = results.map(r => r.remedy.name.toLowerCase());

            expect(remedyNames).toContain('belladonna');
        });

        it('should have Rhus Tox for joint pain better from motion', () => {
            const symptoms = repertoryDataService.searchSymptoms('better from motion');
            const symptomIds = symptoms.map(s => s.id);

            const results = repertoryDataService.analyzeSymptoms(symptomIds);
            const remedyNames = results.map(r => r.remedy.name.toLowerCase());

            expect(remedyNames.some(name => name.includes('rhus'))).toBe(true);
        });
    });
});
