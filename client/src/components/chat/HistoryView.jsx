import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '../ui/Card';
import { Calendar, Clock, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const HistoryView = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' (History) | 'library'

    useEffect(() => {
        const fetchHistory = async () => {
            // Mock history for now if API fails or is empty, to show UI
            try {
                const res = await axios.get('/api/history');
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const resources = [
        { title: "Boericke's Materia Medica", type: "Web", url: "http://www.homeoint.org/books/boericmm/index.htm", desc: "The definitive pocket manual of homeopathic materia medica." },
        { title: "Kent's Repertory", type: "Web", url: "http://www.homeoint.org/books/kentrep/index.htm", desc: "Standard reference for symptom analysis." },
        { title: "Allen's Keynotes", type: "PDF", url: "https://www.homeopathycenter.org/sites/default/files/allens_keynotes.pdf", desc: "Essential characteristics of leading remedies." },
        { title: "Organon of Medicine", type: "Web", url: "http://www.homeoint.org/books/hahnorganon/index.htm", desc: "The foundational text by Samuel Hahnemann." }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 font-mono">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h2 className="text-3xl font-display font-medium text-phosphor tracking-widest">ARCHIVES & LIBRARY</h2>
                <div className="flex gap-2 p-1 terminal-box rounded-lg">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${activeTab === 'active' ? 'bg-phosphor/20 text-phosphor font-bold' : 'text-phosphor/50 hover:text-phosphor'}`}
                    >
                        CONSULTATIONS
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${activeTab === 'library' ? 'bg-phosphor/20 text-phosphor font-bold' : 'text-phosphor/50 hover:text-phosphor'}`}
                    >
                        LIBRARY
                    </button>
                </div>
            </div>

            {activeTab === 'active' ? (
                <div className="space-y-6">
                    <h2 className="text-xl text-phosphor tracking-widest border-b border-phosphor/30 pb-4">
                        CONSULTATION_LOGS
                    </h2>

                    {loading ? (
                        <div className="text-phosphor/50 animate-pulse">LOADING_ARCHIVES...</div>
                    ) : history.length === 0 ? (
                        <div className="terminal-box p-8 text-center text-phosphor/50">
                            NO_RECORDS_FOUND
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {history.map((record) => (
                                <motion.div
                                    key={record.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="terminal-box p-6 hover:bg-phosphor/5 transition-colors group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs text-phosphor/40 font-mono">
                                            ID: {record.id.substring(0, 8)}
                                        </span>
                                        <span className="text-xs text-phosphor/40">
                                            {new Date(record.timestamp).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <FileText className="text-phosphor opacity-50" size={24} />
                                        <div>
                                            <h3 className="text-lg text-phosphor mb-2 group-hover:text-white transition-colors">
                                                {record.remedy || 'Evaluation Pending'}
                                            </h3>
                                            <p className="text-sm text-phosphor/70 line-clamp-2 font-mono">
                                                {record.summary || 'Click to view full transcript...'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.map((res, idx) => (
                        <motion.a
                            key={idx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="block"
                        >
                            <div className="terminal-box p-6 hover:bg-phosphor/5 transition-colors h-full group cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <span className={`text-xs px-2 py-1 rounded border font-mono ${res.type === 'PDF' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                                        {res.type}
                                    </span>
                                    <ArrowRight size={18} className="text-phosphor/50 group-hover:text-phosphor transition-colors -rotate-45 group-hover:rotate-0 transform duration-300" />
                                </div>
                                <h3 className="text-xl font-display font-medium text-phosphor mb-2">{res.title}</h3>
                                <p className="text-phosphor/60 text-sm leading-relaxed font-mono">{res.desc}</p>
                            </div>
                        </motion.a>
                    ))}
                </div>
            )}
        </div>
    );
};
