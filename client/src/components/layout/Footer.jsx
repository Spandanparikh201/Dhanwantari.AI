import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative z-10 mt-auto bg-blue-950 text-white border-t border-blue-900">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-blue-200/80 text-sm font-body">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-400 fill-red-400 animate-pulse" />
                        <span>for Homeopathy</span>
                    </div>

                    <div className="text-blue-300/60 text-xs font-mono tracking-widest uppercase">
                        DHANWANTARI © 2026 • AI-Powered Homeopathy Assistant
                    </div>

                    <div className="flex gap-6 text-sm text-blue-200/80 font-body">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">About</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
