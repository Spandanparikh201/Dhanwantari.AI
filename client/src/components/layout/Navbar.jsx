import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sparkles, Activity, Layers, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, []);

    const navLinks = [
        { name: 'Home', icon: <Sparkles size={16} />, path: '/' },
        { name: 'Archives', icon: <Layers size={16} />, path: '/history' },
        { name: 'Consultation', icon: <Activity size={16} />, path: '/consultation' },
    ];

    const handleNav = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowUserMenu(false);
        navigate('/');
    };

    // Function to get user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className="max-w-7xl mx-auto">
                <div className="rounded-2xl px-6 py-4 flex items-center justify-between bg-blue-900 shadow-lg border-2 border-white">

                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('/')}>
                        <div className="w-10 h-10 rounded-lg bg-blue-300 flex items-center justify-center">
                            <span className="font-display font-bold text-xl text-blue-900">D</span>
                        </div>
                        <span className="font-display font-bold text-lg tracking-wide hidden md:block text-white">
                            DHANWANTARI
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNav(link.path)}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300
                  ${location.pathname === link.path ? 'text-blue-300' : 'text-white/80 hover:text-white'}`}
                            >
                                {link.icon}
                                {link.name}
                            </button>
                        ))}

                        {/* User Account or Login/Register */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-accent font-bold text-sm">
                                        {getUserInitials(user.name)}
                                    </div>
                                    <span className="text-white font-medium text-sm">{user.name}</span>
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 top-14 w-48 glass-panel rounded-xl p-2 border border-white/10"
                                    >
                                        <button
                                            onClick={() => {
                                                handleNav('/profile');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 text-secondary-dim hover:text-accent transition-colors"
                                        >
                                            <User size={16} />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 text-secondary-dim hover:text-red-400 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="secondary"
                                    className="px-6 py-2 text-sm"
                                    onClick={() => handleNav('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    className="px-6 py-2 text-sm"
                                    onClick={() => handleNav('/register')}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-secondary hover:text-accent transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Nav Dropdown */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-20 left-4 right-4 bg-white rounded-2xl p-4 flex flex-col gap-4 md:hidden shadow-xl border border-gray-200"
                    >
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNav(link.path)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors w-full text-left"
                            >
                                <div className="text-primary">{link.icon}</div>
                                <span className="text-text-main">{link.name}</span>
                            </button>
                        ))}

                        {/* Mobile User Section */}
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 p-3 border-t border-white/10" onClick={() => handleNav('/profile')}>
                                    <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center text-accent font-bold">
                                        {getUserInitials(user.name)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{user.name}</span>
                                        <span className="text-xs text-accent">View Profile</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors w-full"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                                <Button
                                    variant="secondary"
                                    className="w-full py-2 text-sm"
                                    onClick={() => handleNav('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    className="w-full py-2 text-sm"
                                    onClick={() => handleNav('/register')}
                                >
                                    Get Started
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
