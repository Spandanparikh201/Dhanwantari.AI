import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';

export const PrescriptionCard = ({ prescription, onClose }) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const response = await axios.post('/api/prescription/generate', {
                patientName: "Guest User", // In real app, get from auth context
                summary: prescription.reasoning,
                remedy: `${prescription.remedy} ${prescription.potency}`,
                messages: [] // Optional: if we want full transcript in PDF
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prescription_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download Error:", err);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-phosphor-bg/90 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-2xl terminal-box p-8 relative max-h-[90vh] overflow-y-auto"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-phosphor/50 hover:text-phosphor transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-8 border-b border-phosphor/20 pb-6">
                    <h2 className="text-2xl font-display font-bold text-phosphor tracking-widest mb-2">
                        PRESCRIPTION_DATA
                    </h2>
                    <p className="text-phosphor/60 font-mono text-sm">
                        Rx_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                </div>

                <div className="space-y-6 font-mono text-phosphor/90">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-phosphor/20 rounded bg-phosphor/5">
                            <div className="text-xs text-phosphor/50 uppercase mb-1">Remedy</div>
                            <div className="text-xl font-bold text-phosphor text-glow">{prescription.remedy}</div>
                        </div>
                        <div className="p-4 border border-phosphor/20 rounded bg-phosphor/5">
                            <div className="text-xs text-phosphor/50 uppercase mb-1">Potency</div>
                            <div className="text-xl font-bold">{prescription.potency || '30C'}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm text-phosphor/50 uppercase tracking-widest">Clinical Reasoning</h3>
                        <p className="leading-relaxed border-l-2 border-phosphor/30 pl-4">
                            {prescription.reasoning}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm text-phosphor/50 uppercase tracking-widest">Symptoms Covered</h3>
                        <div className="flex flex-wrap gap-2">
                            {prescription.symptoms_covered?.map((s, i) => (
                                <span key={i} className="text-xs px-2 py-1 border border-phosphor/20 rounded-full bg-phosphor/5">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border border-red-500/20 rounded bg-red-500/5 flex gap-3">
                        <AlertTriangle className="text-red-400 shrink-0" size={20} />
                        <p className="text-[10px] text-red-400/80 leading-normal">
                            {prescription.disclaimer}
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <Button
                        variant="ghost"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        variant="solid"
                        className="flex-1"
                        onClick={handleDownload}
                        disabled={downloading}
                    >
                        {downloading ? "Generating..." : (
                            <>
                                <Download size={18} className="mr-2" /> Download PDF
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};
