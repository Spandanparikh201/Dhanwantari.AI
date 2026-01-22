import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, History, FileText } from 'lucide-react';

const PatientDashboard = ({ user }) => {
    return (
        <div className="space-y-8 font-mono">
            <header className="border-b border-phosphor/30 pb-4">
                <h1 className="text-3xl text-phosphor tracking-widest">PATIENT_PORTAL</h1>
                <p className="text-phosphor/60 font-mono text-sm mt-2">ID: {user.id} | STATUS: ACTIVE</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* New Consultation */}
                <Link to="/consultation" className="group">
                    <div className="terminal-box p-6 h-full hover:bg-phosphor/10 transition-colors cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={64} />
                        </div>
                        <h2 className="text-xl mb-4 text-phosphor group-hover:text-white transition-colors">INITIATE_CONSULT</h2>
                        <p className="text-sm text-phosphor/70 mb-4">Start a new AI-assisted homeopathic intake session.</p>
                        <span className="text-xs border border-phosphor px-2 py-1 rounded inline-block">START &rarr;</span>
                    </div>
                </Link>

                {/* History */}
                <Link to="/history" className="group">
                    <div className="terminal-box p-6 h-full hover:bg-phosphor/10 transition-colors cursor-pointer">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <History size={64} />
                        </div>
                        <h2 className="text-xl mb-4 text-phosphor">CASE_ARCHIVES</h2>
                        <p className="text-sm text-phosphor/70 mb-4">View past consultations and generated remedies.</p>
                        <span className="text-xs border border-phosphor px-2 py-1 rounded inline-block">ACCESS &rarr;</span>
                    </div>
                </Link>

                {/* Prescriptions (Placeholder for now) */}
                <div className="terminal-box p-6 h-full opacity-60">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FileText size={64} />
                    </div>
                    <h2 className="text-xl mb-4 text-phosphor">PRESCRIPTIONS</h2>
                    <p className="text-sm text-phosphor/70 mb-4">No active prescriptions on file.</p>
                    <span className="text-xs border border-phosphor/50 px-2 py-1 rounded inline-block">EMPTY</span>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
