
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Button } from '../components/ui/Button'; // Assuming Button component availability
import { Search, Plus, X, Activity, Database } from 'lucide-react';

const RemedyFinder = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    // Debounced search
    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                try {
                    const token = localStorage.getItem('token');
                    const headers = token ? { Authorization: `Bearer ${token}` } : {};
                    const res = await axios.get(`http://localhost:3000/api/repertory/search?q=${query}`, { headers });
                    setSearchResults(res.data);
                } catch (err) {
                    console.error("Search failed", err);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const addSymptom = (symptom) => {
        if (!selectedSymptoms.find(s => s.id === symptom.id)) {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
            setQuery('');
            setSearchResults([]);
        }
    };

    const removeSymptom = (id) => {
        setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== id));
    };

    const analyze = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.post('http://localhost:3000/api/repertory/analyze', {
                symptomIds: selectedSymptoms.map(s => s.id)
            }, { headers });
            setResults(res.data);
        } catch (err) {
            console.error("Analysis failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <header className="border-b border-phosphor/20 pb-4 mb-8">
                <h1 className="text-3xl font-display text-phosphor tracking-wider uppercase flex items-center gap-3">
                    <Database className="w-8 h-8" />
                    Bio-Repertory Analysis
                </h1>
                <p className="text-phosphor/60 mt-2 font-mono text-sm">
                    Enter clinical symptoms to generate homeopathic correlations.
                </p>
            </header>

            {/* Search Section */}
            <div className="relative z-20">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-phosphor/50 group-focus-within:text-phosphor transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-4 bg-bg-dark border border-phosphor/30 rounded-none text-phosphor placeholder-phosphor/30 focus:outline-none focus:border-phosphor focus:ring-1 focus:ring-phosphor transition-all font-mono"
                        placeholder="SEARCH_SYMPTOM_DATABASE..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <AnimatePresence>
                    {searchResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-30 w-full mt-1 bg-bg-dark border border-phosphor/30 shadow-lg max-h-60 overflow-y-auto custom-scrollbar"
                        >
                            {searchResults.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => addSymptom(s)}
                                    className="w-full text-left px-4 py-3 hover:bg-phosphor/10 border-b border-phosphor/10 flex justify-between items-center group font-mono text-sm text-phosphor/80 hover:text-phosphor"
                                >
                                    <span>{s.name} <span className="text-xs text-phosphor/40 ml-2">[{s.category}]</span></span>
                                    <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Selected Symptoms (Cart) */}
            {selectedSymptoms.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-mono text-phosphor/50 uppercase tracking-widest">Selected Parameters</h3>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {selectedSymptoms.map(s => (
                                <motion.div
                                    key={s.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex items-center gap-2 bg-phosphor/5 border border-phosphor/20 px-3 py-1.5 rounded-sm"
                                >
                                    <span className="text-sm font-mono text-phosphor">{s.name}</span>
                                    <button
                                        onClick={() => removeSymptom(s.id)}
                                        className="text-phosphor/40 hover:text-red-400 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Action */}
            <div className="flex justify-end">
                <Button
                    onClick={analyze}
                    disabled={selectedSymptoms.length === 0 || loading}
                    className="w-full md:w-auto"
                >
                    {loading ? 'ANALYZING...' : 'INITIATE_REPERTORIZATION'}
                </Button>
            </div>

            {/* Results Grid */}
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-8 border-t border-phosphor/20"
                >
                    <h3 className="text-lg font-display text-phosphor flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Analysis Results
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse font-mono text-sm">
                            <thead>
                                <tr className="border-b border-phosphor/30 text-left text-phosphor/60">
                                    <th className="p-4 font-normal">REMEDY</th>
                                    <th className="p-4 font-normal">POTENCY</th>
                                    <th className="p-4 font-normal">SCORE</th>
                                    <th className="p-4 font-normal">INDICATED_FOR</th>
                                    <th className="p-4 font-normal">COVERAGE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r, i) => (
                                    <tr key={r.remedy.id} className="border-b border-phosphor/10 hover:bg-phosphor/5 transition-colors">
                                        <td className="p-4 font-bold text-phosphor">
                                            {r.remedy.name}
                                        </td>
                                        <td className="p-4 text-phosphor/70">
                                            {r.remedy.potency || '30C'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-phosphor">{r.score}</span>
                                                <div className="h-1.5 flex-1 bg-phosphor/10 rounded-full min-w-[60px]">
                                                    <div
                                                        className="h-full bg-phosphor rounded-full"
                                                        style={{ width: `${Math.min((r.score / (selectedSymptoms.length * 3)) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-phosphor/70">
                                            <div className="flex flex-wrap gap-1">
                                                {(r.diseases || []).slice(0, 3).map((d, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-phosphor/10 rounded text-xs">
                                                        {d}
                                                    </span>
                                                ))}
                                                {(r.diseases || []).length > 3 && (
                                                    <span className="text-xs text-phosphor/40">+{r.diseases.length - 3} more</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-phosphor/70">
                                            {r.coveredSymptoms.length}/{selectedSymptoms.length}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default RemedyFinder;
