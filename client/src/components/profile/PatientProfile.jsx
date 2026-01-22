import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Phone, Calendar } from 'lucide-react';

const PatientProfile = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="terminal-box p-8 text-center">
                <p className="text-phosphor/50">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 font-mono">
            <header className="border-b border-phosphor/30 pb-4">
                <h1 className="text-3xl text-phosphor tracking-widest">PATIENT_PROFILE</h1>
                <p className="text-phosphor/60 text-sm mt-2">ID: {user.id} | STATUS: ACTIVE</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="terminal-box p-6">
                    <h2 className="text-lg text-phosphor mb-4 border-b border-phosphor/20 pb-2">PERSONAL_INFO</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User size={18} className="text-phosphor/50" />
                            <div>
                                <div className="text-xs text-phosphor/40">Name</div>
                                <div className="text-phosphor">{user.name}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-phosphor/50" />
                            <div>
                                <div className="text-xs text-phosphor/40">Email</div>
                                <div className="text-phosphor">{user.email}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-phosphor/50" />
                            <div>
                                <div className="text-xs text-phosphor/40">Phone</div>
                                <div className="text-phosphor">{user.phone || 'Not provided'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-phosphor/50" />
                            <div>
                                <div className="text-xs text-phosphor/40">Member Since</div>
                                <div className="text-phosphor">{new Date(user.created_at || Date.now()).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="terminal-box p-6">
                    <h2 className="text-lg text-phosphor mb-4 border-b border-phosphor/20 pb-2">ACCOUNT_DETAILS</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs text-phosphor/40">Role</div>
                            <div className="text-phosphor uppercase">{user.role || 'patient'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-phosphor/40">Total Consultations</div>
                            <div className="text-phosphor">0</div>
                        </div>
                        <div>
                            <div className="text-xs text-phosphor/40">Active Prescriptions</div>
                            <div className="text-phosphor">0</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical History Placeholder */}
            <div className="terminal-box p-6">
                <h2 className="text-lg text-phosphor mb-4 border-b border-phosphor/20 pb-2">MEDICAL_HISTORY</h2>
                <div className="text-phosphor/50 text-center py-8">
                    No medical history recorded yet. Start a consultation to build your profile.
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
