import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Award, Check, X, Clock, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

const DoctorCard = ({ doctor, onVerify }) => {
    const isVerified = doctor.verified;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-blue-300 hover:shadow-md transition-all duration-300"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100">
                        {doctor.full_name?.charAt(0) || 'D'}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{doctor.full_name}</h3>
                        <p className="text-blue-600 text-sm font-medium">{doctor.specialization}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${isVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                    {isVerified ? (
                        <div className="flex items-center gap-1"><Shield size={12} /> Verified</div>
                    ) : (
                        <div className="flex items-center gap-1"><Clock size={12} /> Pending</div>
                    )}
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Award size={14} className="text-blue-500" />
                    <span>{doctor.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield size={14} className="text-purple-500" />
                    <span className="font-mono text-xs opacity-75">{doctor.registration_number}</span>
                </div>
                {doctor.clinic_name && (
                    <div className="flex items-start gap-2 text-sm text-gray-500">
                        <MapPin size={14} className="text-pink-500 mt-0.5" />
                        <span className="line-clamp-1">{doctor.clinic_name}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                    Member since {new Date(doctor.created_at).toLocaleDateString()}
                </div>

                {!isVerified ? (
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 px-3 py-1 text-xs"
                            onClick={() => onVerify(doctor.id, 'rejected')}
                        >
                            <X size={14} />
                        </Button>
                        <Button
                            className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200 px-3 py-1 text-xs"
                            onClick={() => onVerify(doctor.id, 'approved')}
                        >
                            <Check size={14} /> Approve
                        </Button>
                    </div>
                ) : (
                    <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                        <Check size={14} /> Active
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default DoctorCard;
