import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ChatInterface } from '../components/chat/ChatInterface';
import { Button } from '../components/ui/Button';
import { Terminal, LogOut } from 'lucide-react';
import axios from 'axios';

const Consultation = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [hasStarted, setHasStarted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {

        }
    }, [user, navigate]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4 border border-red-100">
                    <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-mono text-phosphor">AUTHENTICATION_REQUIRED</h2>
                <p className="text-phosphor/70">Please log in to access the consultation protocol.</p>
                <Button
                    onClick={() => navigate('/login')}
                    className="border border-phosphor text-phosphor hover:bg-phosphor/10 mt-4"
                >
                    LOGIN_SEQUENCE
                </Button>
            </div>
        );
    }

    const handleTerminate = async () => {
        if (!window.confirm("Are you sure you want to terminate this session? This will archive the current consultation.")) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/chat/end', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/history'); // Or dashboard
        } catch (error) {
            console.error("Failed to terminate session:", error);
            alert("Failed to terminate session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!hasStarted) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-4 mt-8">
                <div className="w-full max-w-md p-8 border border-phosphor/30 rounded-lg bg-black/40 backdrop-blur-sm text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-phosphor/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-phosphor/10 flex items-center justify-center border border-phosphor/30 text-phosphor">
                        <Terminal size={32} />
                    </div>

                    <h1 className="text-2xl font-display tracking-wider text-phosphor mb-2">NEW_CONSULTATION</h1>
                    <p className="text-sm font-mono text-phosphor/60 mb-8">
                        Initialize AI-driven homeopathic case taking module.
                        <br />Ensure patient is ready for detailed symptom analysis.
                    </p>

                    <Button
                        onClick={() => setHasStarted(true)}
                        className="w-full py-6 text-lg tracking-widest bg-phosphor/10 hover:bg-phosphor/20 border border-phosphor text-phosphor transition-all"
                    >
                        [ INITIATE_PROTOCOL ]
                    </Button>

                    <div className="mt-6 text-xs text-phosphor/40 font-mono">
                        SECURE_CONNECTION_ESTABLISHED
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 md:mb-8 pb-4 border-b border-phosphor/20">
                <div className="flex items-center gap-2 md:gap-4">
                    <Button variant="ghost" className="!px-2 md:!px-4 text-phosphor/60 hover:text-phosphor" onClick={() => setHasStarted(false)}>
                        <span className="md:hidden">←</span>
                        <span className="hidden md:inline">← BACK</span>
                    </Button>
                    <h2 className="text-sm md:text-xl tracking-widest text-phosphor uppercase">
                        <span className="md:hidden">ACTIVE_SESSION</span>
                        <span className="hidden md:inline">Consultation_Active</span>
                    </h2>
                </div>

                <Button
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/10 border border-red-900/30 px-3 md:px-4"
                    onClick={handleTerminate}
                    disabled={loading}
                >
                    <span className="md:hidden text-xs">[ END ]</span>
                    <span className="hidden md:inline">{loading ? 'TERMINATING...' : '[ TERMINATE_SESSION ]'}</span>
                </Button>
            </div>

            <ChatInterface />
        </div>
    );
};

export default Consultation;
