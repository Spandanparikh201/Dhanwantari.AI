import React from 'react';
import { motion } from 'framer-motion';

export const FloatingShapes = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* 3D Cube-like Shapes */}

            {/* Shape 1: Top Right - Blue Cube */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotateX: [0, 180, 360],
                    rotateY: [0, 180, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-20 right-[10%] w-24 h-24 opacity-20"
                style={{ perspective: '1000px' }}
            >
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-2xl backdrop-blur-sm transform rotate-45 border border-white/30" />
            </motion.div>

            {/* Shape 2: Bottom Left - Floating Prism */}
            <motion.div
                animate={{
                    y: [0, 30, 0],
                    rotate: [0, -360],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-40 left-[5%] w-32 h-32 opacity-15"
            >
                <div className="w-full h-full bg-gradient-to-tr from-cyan-300 to-blue-500 rounded-3xl shadow-xl backdrop-blur-md border border-white/20"
                    style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                />
            </motion.div>

            {/* Shape 3: Center Right - Glass Sphere */}
            <motion.div
                animate={{
                    x: [0, -40, 0],
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/2 right-[20%] w-40 h-40 opacity-10"
            >
                <div className="w-full h-full bg-gradient-to-b from-white/40 to-blue-200/10 rounded-full backdrop-blur-xl border border-white/40 shadow-inner" />
            </motion.div>

            {/* Shape 4: Top Left - Small Pyramid */}
            <motion.div
                animate={{
                    rotateZ: [0, 360],
                    y: [0, 15, 0]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-32 left-[15%] w-16 h-16 opacity-20"
            >
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400"
                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                />
            </motion.div>
        </div>
    );
};
