import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, UserPlus, Activity, Search, Filter } from 'lucide-react';
import StatsCard from '../components/admin/StatsCard';
import DoctorCard from '../components/admin/DoctorCard';
import PatientCard from '../components/admin/PatientCard';
import { Input } from '../components/ui/Input';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'users'
    const [doctors, setDoctors] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ users: 0, doctors: 0, pendingDoctors: 0, consultations: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, verified, pending

    useEffect(() => {
        fetchData();
        fetchStats();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            if (activeTab === 'doctors') {
                const response = await fetch('/api/admin/doctors', { headers });
                if (response.ok) {
                    const data = await response.json();
                    setDoctors(data);
                }
            } else {
                const response = await fetch('/api/admin/users', { headers });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (doctorId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/doctors/${doctorId}/verify`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                fetchData();
                fetchStats(); // Update pending count
            } else {
                alert('Action failed');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating doctor status');
        }
    };

    const filteredDoctors = doctors.filter(doc => {
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'verified' ? doc.verified : !doc.verified;

        const matchesSearch = doc.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.registration_number?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-100/40 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500">Platform overview and user management</p>
                    </div>

                    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                        <button
                            onClick={() => setActiveTab('doctors')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'doctors' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            Medical Staff
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            Patients
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatsCard title="Total Patients" count={stats.users} icon={Users} color="purple" delay={0.1} />
                    <StatsCard title="Total Doctors" count={stats.doctors} icon={Shield} color="blue" delay={0.2} />
                    <StatsCard title="Pending Verifications" count={stats.pendingDoctors} icon={UserPlus} color="yellow" delay={0.3} />
                    <StatsCard title="Total Consultations" count={stats.consultations} icon={Activity} color="green" delay={0.4} />
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === 'doctors' ? 'doctors by name, reg ID...' : 'patients by name, email...'}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        {activeTab === 'doctors' && (
                            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-500 hover:bg-gray-50 border border-transparent'}`}>All Doctors</button>
                                <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${filter === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'text-gray-500 hover:bg-gray-50 border border-transparent'}`}>Pending Approval</button>
                                <button onClick={() => setFilter('verified')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${filter === 'verified' ? 'bg-green-50 text-green-700 border border-green-200' : 'text-gray-500 hover:bg-gray-50 border border-transparent'}`}>Verified</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {activeTab === 'doctors' ? (
                            filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doc) => (
                                    <DoctorCard key={doc.id} doctor={doc} onVerify={handleVerify} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <Shield size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-xl text-gray-500 font-medium">No doctors found matching filters</h3>
                                </div>
                            )
                        ) : (
                            filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <PatientCard key={user.id} user={user} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-xl text-gray-500 font-medium">No patients found</h3>
                                </div>
                            )
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
