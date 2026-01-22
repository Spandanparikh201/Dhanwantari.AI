import React, { useEffect, useState } from 'react';
import { Users, FileText, Activity } from 'lucide-react';
import axios from 'axios';

const DoctorDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        patients: 0,
        consultations: 0,
        earnings: '₹0'
    });

    return (
        <div className="space-y-8 font-mono">
            <header className="border-b border-phosphor/30 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl text-phosphor tracking-widest">DOCTOR_CONSOLE</h1>
                    <p className="text-phosphor/60 font-mono text-sm mt-2">DR. {user.name.toUpperCase()} | REG: {user.profile?.registration_number || 'PENDING'}</p>
                </div>
                <div className="text-xs text-phosphor/50 flex gap-4">
                    <span>SYSTEM_STATUS: ONLINE</span>
                    <span>VERIFICATION: {user.verified ? 'VERIFIED' : 'PENDING'}</span>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="terminal-box p-6">
                    <div className="text-xs text-phosphor/50 mb-2 uppercase tracking-widest">Total Patients</div>
                    <div className="text-4xl font-bold flex items-end gap-2">
                        {stats.patients} <Users size={24} className="mb-2 opacity-50" />
                    </div>
                </div>
                <div className="terminal-box p-6">
                    <div className="text-xs text-phosphor/50 mb-2 uppercase tracking-widest">Pending Consults</div>
                    <div className="text-4xl font-bold flex items-end gap-2">
                        {stats.consultations} <Activity size={24} className="mb-2 opacity-50" />
                    </div>
                </div>
                <div className="terminal-box p-6">
                    <div className="text-xs text-phosphor/50 mb-2 uppercase tracking-widest">Est. Earnings</div>
                    <div className="text-4xl font-bold flex items-end gap-2">
                        {stats.earnings} <FileText size={24} className="mb-2 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Main Work Area */}
            <div className="terminal-box p-6 min-h-[300px] flex items-center justify-center border-dashed">
                <div className="text-center opacity-50">
                    <Activity size={48} className="mx-auto mb-4" />
                    <p>NO COMPLETED AI CONSULTATIONS REQUIRE REVIEW</p>
                    <p className="text-xs mt-2">Waiting for incoming patient data stream...</p>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
