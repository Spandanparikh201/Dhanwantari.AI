import React from 'react';
import { motion } from 'framer-motion';
import { User, Droplet, Activity, Calendar } from 'lucide-react';

const PatientCard = ({ user }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-purple-300 hover:shadow-md transition-all duration-300"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-xl border border-purple-100 relative">
                    {user.full_name?.charAt(0) || 'U'}
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{user.full_name || 'Anonymous User'}</h3>
                    <p className="text-gray-500 text-xs truncate max-w-[200px]">{user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center gap-2">
                    <Droplet size={14} className="text-red-500" />
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Blood</p>
                        <p className="text-sm font-medium text-gray-900">{user.blood_group || 'N/A'}</p>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center gap-2">
                    <User size={14} className="text-blue-500" />
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Gender</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{user.gender || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600">
                    Patient
                </span>
            </div>
        </motion.div>
    );
};

export default PatientCard;
