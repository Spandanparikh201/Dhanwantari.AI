import React from 'react';
import { motion } from 'framer-motion';

export const OrganicOrb = () => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Core Orb */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-xl opacity-20"
            />

            {/* Secondary Orb */}
            <motion.div
                animate={{
                    scale: [1.1, 1, 1.1],
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-32 h-32 bg-gradient-to-tr from-cyan-300 to-blue-400 rounded-full blur-2xl opacity-30"
            />

            {/* Ripple Rings */}
            <motion.div
                animate={{
                    scale: [0.8, 1.2],
                    opacity: [0.3, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
                className="absolute w-full h-full border border-blue-200/30 rounded-full"
            />
            <motion.div
                animate={{
                    scale: [0.8, 1.2],
                    opacity: [0.3, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 1.5
                }}
                className="absolute w-3/4 h-3/4 border border-indigo-200/30 rounded-full"
            />
        </div>
    );
};
