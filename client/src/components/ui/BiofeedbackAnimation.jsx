import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Brain } from 'lucide-react';

export const BiofeedbackAnimation = ({ status = 'idle' }) => {
    // Animation variants based on status
    const getAnimationSpeed = () => {
        switch (status) {
            case 'active': return 2;
            case 'success': return 4;
            case 'error': return 6;
            default: return 8; // idle
        }
    };

    const getColor = () => {
        switch (status) {
            case 'active': return 'from-blue-400 to-blue-600';
            case 'success': return 'from-green-400 to-emerald-600';
            case 'error': return 'from-red-400 to-red-600';
            default: return 'from-blue-300 to-indigo-400';
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Central Pulse Icon */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                }}
                transition={{
                    duration: getAnimationSpeed(),
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-10"
            >
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getColor()} flex items-center justify-center shadow-2xl`}>
                    {status === 'active' ? (
                        <Activity className="w-12 h-12 text-white" strokeWidth={2.5} />
                    ) : status === 'success' ? (
                        <Heart className="w-12 h-12 text-white" strokeWidth={2.5} />
                    ) : (
                        <Brain className="w-12 h-12 text-white" strokeWidth={2.5} />
                    )}
                </div>
            </motion.div>

            {/* Orbiting Particles */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: getAnimationSpeed() + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.5
                    }}
                    className="absolute w-full h-full"
                    style={{
                        transformOrigin: 'center',
                    }}
                >
                    <div
                        className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${getColor()} blur-sm`}
                        style={{
                            top: '50%',
                            left: `${50 + (i + 1) * 15}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                </motion.div>
            ))}

            {/* Pulsing Rings */}
            {[...Array(2)].map((_, i) => (
                <motion.div
                    key={`ring-${i}`}
                    animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: i * 1.5
                    }}
                    className={`absolute w-32 h-32 rounded-full border-2 border-blue-400`}
                />
            ))}

            {/* DNA Helix Strands */}
            <svg className="absolute w-full h-full opacity-20" viewBox="0 0 200 200">
                <motion.path
                    d="M 50 20 Q 100 50, 150 20 T 250 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-blue-500"
                    animate={{
                        d: [
                            "M 50 20 Q 100 50, 150 20 T 250 20",
                            "M 50 40 Q 100 10, 150 40 T 250 40",
                            "M 50 20 Q 100 50, 150 20 T 250 20"
                        ]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.path
                    d="M 50 180 Q 100 150, 150 180 T 250 180"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-indigo-500"
                    animate={{
                        d: [
                            "M 50 180 Q 100 150, 150 180 T 250 180",
                            "M 50 160 Q 100 190, 150 160 T 250 160",
                            "M 50 180 Q 100 150, 150 180 T 250 180"
                        ]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </svg>
        </div>
    );
};
