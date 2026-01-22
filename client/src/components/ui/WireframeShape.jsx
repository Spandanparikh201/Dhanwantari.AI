import React from 'react';
import { motion } from 'framer-motion';

export const WireframeShape = () => {
    return (
        <motion.div
            animate={{
                rotateY: [0, 360],
                rotateX: [0, 15, 0],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }}
            className="relative w-48 h-48"
        >
            {/* Wireframe Cube */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <g stroke="currentColor" strokeWidth="1" fill="none" className="text-phosphor/30">
                    {/* Front face */}
                    <rect x="50" y="50" width="100" height="100" />
                    {/* Back face */}
                    <rect x="30" y="30" width="100" height="100" />
                    {/* Connecting lines */}
                    <line x1="50" y1="50" x2="30" y2="30" />
                    <line x1="150" y1="50" x2="130" y2="30" />
                    <line x1="50" y1="150" x2="30" y2="130" />
                    <line x1="150" y1="150" x2="130" y2="130" />
                </g>

                {/* Animated dots at vertices */}
                <motion.circle
                    cx="50" cy="50" r="2"
                    className="fill-phosphor"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle
                    cx="150" cy="50" r="2"
                    className="fill-phosphor"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle
                    cx="50" cy="150" r="2"
                    className="fill-phosphor"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.circle
                    cx="150" cy="150" r="2"
                    className="fill-phosphor"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
            </svg>
        </motion.div>
    );
};
