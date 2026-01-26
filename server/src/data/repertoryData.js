
const symptoms = [
    { id: "s1", name: "Headache; throbbing", category: "Head" },
    { id: "s2", name: "Headache; better from cold applications", category: "Head" },
    { id: "s3", name: "Headache; worse from light", category: "Head" },
    { id: "s4", name: "Anxiety; anticipation", category: "Mind" },
    { id: "s5", name: "Anxiety; health about", category: "Mind" },
    { id: "s6", name: "Stomach; burning pain", category: "Stomach" },
    { id: "s7", name: "Stomach; nausea morning", category: "Stomach" },
    { id: "s8", name: "Cough; dry, tickling", category: "Chest" },
    { id: "s9", name: "Fever; high, sudden onset", category: "Generalities" },
    { id: "s10", name: "Thirst; large quantities", category: "Stomach" }
];

const remedies = [
    { id: "r1", name: "Belladonna", common_name: "Deadly Nightshade" },
    { id: "r2", name: "Arsenicum Album", common_name: "Arsenic Trioxide" },
    { id: "r3", name: "Bryonia", common_name: "White Bryony" },
    { id: "r4", name: "Nux Vomica", common_name: "Poison Nut" },
    { id: "r5", name: "Pulsatilla", common_name: "Wind Flower" }
];

// Mapping: Symptom ID -> [{ Remedy ID, Grade (1-3) }]
const repertory = {
    "s1": [{ r: "r1", g: 3 }, { r: "r3", g: 2 }],
    "s2": [{ r: "r1", g: 1 }, { r: "r5", g: 3 }],
    "s3": [{ r: "r1", g: 3 }, { r: "r4", g: 2 }],
    "s4": [{ r: "r2", g: 3 }, { r: "r5", g: 2 }],
    "s5": [{ r: "r2", g: 3 }, { r: "r4", g: 1 }],
    "s6": [{ r: "r2", g: 3 }, { r: "r4", g: 2 }],
    "s7": [{ r: "r4", g: 3 }, { r: "r5", g: 2 }],
    "s8": [{ r: "r3", g: 3 }, { r: "r2", g: 1 }],
    "s9": [{ r: "r1", g: 3 }],
    "s10": [{ r: "r3", g: 3 }, { r: "r2", g: 2 }]
};

module.exports = { symptoms, remedies, repertory };
