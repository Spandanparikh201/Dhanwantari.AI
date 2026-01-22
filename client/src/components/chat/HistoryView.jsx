import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '../ui/Card';
import { Calendar, Clock, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingShapes } from '../ui/FloatingShapes';

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
        <div className="w-full max-w-6xl mx-auto px-4 font-body relative">
            <FloatingShapes />
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 relative z-10">
                <h2 className="text-3xl font-display font-bold text-gray-900 tracking-tight">ARCHIVES & LIBRARY</h2>
                <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                        CONSULTATIONS
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'library' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                        LIBRARY
                    </button>
                </div>
            </div>

            {activeTab === 'active' ? (
                <div className="space-y-6 relative z-10">
                    <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase border-b border-gray-200 pb-2">
                        Recent Consultations
                    </h2>

                    {loading ? (
                        <div className="text-blue-500 animate-pulse font-medium">Loading archives...</div>
                    ) : history.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 shadow-sm">
                            <div className="mb-4 text-6xl">📭</div>
                            No consultation records found.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {history.map((record) => (
                                <motion.div
                                    key={record.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-lg hover:border-blue-300 transition-all group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                            ID: {record.id.substring(0, 8)}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(record.timestamp).toLocaleDateString()}
                                            <Clock size={12} className="ml-2" />
                                            {new Date(record.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                {record.remedy || 'Analysis In Progress'}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {record.summary || 'Click to view full transcript and AI analysis details...'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
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
                            <div className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-lg hover:border-blue-300 transition-all h-full group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-start justify-between mb-4 relative">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold tracking-wide ${res.type === 'PDF' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                        {res.type}
                                    </span>
                                    <div className="p-2 bg-gray-50 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors text-gray-400">
                                        <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transform duration-300" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-display font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{res.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{res.desc}</p>
                            </div>
                        </motion.a>
                    ))}
                </div>
            )}
        </div>
    );
};
