import React from 'react';
import { motion } from 'framer-motion';

export const Input = ({ icon: Icon, className = '', ...props }) => {
    return (
        <div className="relative">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-phosphor/40">
                    <Icon size={18} />
                </div>
            )}
            <motion.input
                whileFocus={{ scale: 1.01 }}
                className={`w-full bg-phosphor-bg/50 border border-phosphor/30 rounded-lg px-4 py-3 ${Icon ? 'pl-12' : ''} text-phosphor placeholder:text-phosphor/30 focus:outline-none focus:border-phosphor transition-colors font-body ${className}`}
                {...props}
            />
        </div>
    );
};
