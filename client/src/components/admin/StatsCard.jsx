import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, count, icon: Icon, color, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-50 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-${color}-100`} />

            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
                    <p className={`text-3xl font-display font-bold text-gray-900 tracking-tight`}>{count}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>

            {/* Decorative bottom line */}
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-${color}-500/0 via-${color}-500/50 to-${color}-500/0 opacity-0 group-hover:opacity-100 transition-opacity`} />
        </motion.div>
    );
};

export default StatsCard;
