
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children, onViewChange }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    // Function to trigger navbar refresh
    const refreshNavbar = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Mouse Tracker Logic Removed for new theme

    return (
        <div className="relative min-h-screen w-full bg-bg-base overflow-hidden text-text-main flex flex-col font-body">
            {/* Navbar */}
            <Navbar key={refreshKey} onViewChange={onViewChange} />

            {/* Subtle Gradient Spots */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-3xl opacity-60 animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Content Container */}
            <main className="relative z-10 container mx-auto px-4 pt-32 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Pass refreshNavbar to children via React.cloneElement if needed */}
                    {React.Children.map(children, child =>
                        React.isValidElement(child)
                            ? React.cloneElement(child, { refreshNavbar })
                            : child
                    )}
                </motion.div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MainLayout;
