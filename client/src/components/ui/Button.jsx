import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, variant = 'primary', className, onClick, ...props }) => {
    const baseStyles = "relative px-8 py-4 rounded-xl font-display font-medium tracking-wide transition-all duration-300 overflow-hidden group";

    const variants = {
        primary: "bg-phosphor-bg/80 border border-phosphor/50 text-phosphor hover:bg-phosphor/10 hover:border-phosphor hover:shadow-[0_0_20px_rgba(0,255,157,0.2)]",
        solid: "bg-phosphor text-phosphor-bg hover:bg-phosphor-dim hover:scale-105 shadow-[0_0_20px_rgba(0,255,157,0.4)] font-bold",
        ghost: "bg-transparent text-phosphor/70 hover:text-phosphor hover:bg-phosphor/5",
        secondary: "bg-phosphor/5 border border-phosphor/20 text-phosphor hover:bg-phosphor/10 hover:border-phosphor/40",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={twMerge(baseStyles, variants[variant], className)}
            onClick={onClick}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
            {/* Hover Gradient Bloom */}
            {variant === 'primary' && (
                <div className="absolute inset-0 -z-0 bg-phosphor/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            )}
        </motion.button>
    );
};
