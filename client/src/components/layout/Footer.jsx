import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative z-10 mt-auto border-t border-phosphor/10 bg-phosphor-bg/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-phosphor/60 text-sm">
                        <span>Made with</span>
                        <Heart size={14} className="text-phosphor fill-phosphor" />
                        <span>for Homeopathy</span>
                    </div>

                    <div className="text-emerald-600/60 text-xs font-mono">
                        DHANWANTARI © 2026 • AI-Powered Homeopathy Assistant
                    </div>

                    <div className="flex gap-4 text-xs text-phosphor/60">
                        <a href="#" className="hover:text-phosphor transition-colors">Privacy</a>
                        <a href="#" className="hover:text-phosphor transition-colors">Terms</a>
                        <a href="#" className="hover:text-phosphor transition-colors">About</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
