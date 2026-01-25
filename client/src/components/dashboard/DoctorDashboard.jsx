import React, { useEffect, useState } from 'react';
import { Users, FileText, Activity, Calendar, Clock, User } from 'lucide-react';

const DoctorDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        patients: 0,
        consultations: 0,
        earnings: '₹0'
    });
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [statsRes, consultsRes] = await Promise.all([
                fetch('/api/doctor/stats', { headers }),
                fetch('/api/doctor/consultations', { headers })
            ]);

            if (statsRes.ok && consultsRes.ok) {
                const statsData = await statsRes.json();
                const consultsData = await consultsRes.json();
                setStats(statsData);
                setConsultations(consultsData);
            }
        } catch (error) {
            console.error('Error fetching doctor dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

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
                <div className="terminal-box p-6 hover:bg-phosphor/5 transition-colors">
                    <div className="text-xs text-phosphor/50 mb-2 uppercase tracking-widest">Total Patients</div>
                    <div className="text-4xl font-bold flex items-end gap-2 text-phosphor">
                        {stats.patients} <Users size={24} className="mb-2 opacity-50" />
                    </div>
                </div>
                <div className="terminal-box p-6 hover:bg-phosphor/5 transition-colors">
                    <div className="text-xs text-phosphor/50 mb-2 uppercase tracking-widest">Pending Consults</div>
                    <div className="text-4xl font-bold flex items-end gap-2 text-phosphor">
                        {stats.consultations} <Activity size={24} className="mb-2 opacity-50" />
                    </div>
                </div>
                <div className="terminal-box p-6 hover:bg-phosphor/5 transition-colors">
                    <div className="text-xs text-phosphor/50 mb-2 uppercase tracking-widest">Est. Earnings</div>
                    <div className="text-4xl font-bold flex items-end gap-2 text-phosphor">
                        {stats.earnings} <FileText size={24} className="mb-2 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Main Work Area - Consultation List */}
            <div className="terminal-box p-6 min-h-[400px]">
                <h2 className="text-xl text-phosphor mb-6 flex items-center gap-2">
                    <Activity size={20} /> PATIENT_CONSULTATION_LOG
                </h2>

                {loading ? (
                    <div className="text-center py-12 text-phosphor/50 animate-pulse">LOADING_DATA_STREAM...</div>
                ) : consultations.length === 0 ? (
                    <div className="text-center py-12 text-phosphor/30 border-2 border-dashed border-phosphor/10 rounded-xl">
                        <Activity size={48} className="mx-auto mb-4 opacity-50" />
                        <p>NO CONSULTATION RECORDS FOUND</p>
                        <p className="text-xs mt-2">Waiting for incoming patient data stream...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-phosphor/20 text-phosphor/60 text-sm">
                                    <th className="p-4 font-mono">PATIENT</th>
                                    <th className="p-4 font-mono">DATE/TIME</th>
                                    <th className="p-4 font-mono">STATUS</th>
                                    <th className="p-4 font-mono">MODE</th>
                                    <th className="p-4 font-mono text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="text-phosphor/90">
                                {consultations.map((consult) => (
                                    <tr key={consult.id} className="border-b border-phosphor/10 hover:bg-phosphor/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-phosphor/10 flex items-center justify-center text-phosphor">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <div className="font-bold">{consult.patient_name}</div>
                                                    <div className="text-xs text-phosphor/50">{consult.gender}, DOB: {consult.date_of_birth || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex flex-col">
                                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(consult.created_at).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1.5 text-phosphor/50"><Clock size={12} /> {new Date(consult.created_at).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${consult.status === 'completed' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                                                    consult.status === 'in_progress' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                                                        'border-phosphor/30 text-phosphor/60'
                                                }`}>
                                                {consult.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-mono opacity-80">
                                            {consult.mode.toUpperCase()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="px-3 py-1.5 border border-phosphor/30 rounded hover:bg-phosphor hover:text-black transition-all text-xs font-bold">
                                                VIEW_PROFILE
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
