import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowRight, Sparkles, Activity, ShieldCheck, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-12 md:space-y-20 w-full px-4"
        >
            {/* Hero Section */}
            <section className="text-center space-y-6 md:space-y-8 max-w-4xl relative mx-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-accent/5 blur-[100px] rounded-full -z-10" />

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm text-accent text-xs md:text-sm font-medium tracking-wide mb-4">
                    <Sparkles size={14} />
                    <span>AI-Powered Homeopathy Engine</span>
                </div>

                <h1 className="text-center text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter text-blue-900 drop-shadow-sm leading-tight py-2 w-full">
                    DHANWANTARI
                </h1>

                <div className="flex flex-col gap-4 text-center items-center justify-center max-w-2xl mx-auto px-4">
                    <p className="text-lg md:text-xl text-secondary-dim/90 font-body leading-relaxed">
                        An advanced AI simulating the logic of a classical homeopath.
                    </p>

                    {/* System Info Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4">
                        <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                            <div className="p-2 rounded-full bg-accent/10 text-accent"><Activity size={18} /></div>
                            <h3 className="text-white font-medium text-sm">AI-Powered Analysis</h3>
                            <p className="text-secondary-dim text-xs">Advanced symptom pattern recognition using Google Gemini AI.</p>
                        </div>
                        <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                            <div className="p-2 rounded-full bg-purple-500/10 text-purple-400"><Microscope size={18} /></div>
                            <h3 className="text-white font-medium text-sm">Classical Methodology</h3>
                            <p className="text-secondary-dim text-xs">Follows traditional homeopathic principles & case-taking protocols.</p>
                        </div>
                        <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400"><ShieldCheck size={18} /></div>
                            <h3 className="text-white font-medium text-sm">Educational Focus</h3>
                            <p className="text-secondary-dim text-xs">Learn homeopathy safely with AI guidance & instant feedback.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4 md:pt-8 w-full sm:w-auto">
                    <Button
                        variant="solid"
                        className="w-full sm:w-auto text-lg px-8 py-4 md:py-5"
                        onClick={() => navigate('/consultation')}
                    >
                        Start Consultation <ArrowRight size={20} />
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full sm:w-auto text-lg px-8 py-4 md:py-5"
                        onClick={() => navigate('/history')}
                    >
                        Archives
                    </Button>
                </div>
            </section>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                <Card title="Intelligent Consultation" className="border-accent/20">
                    <div className="flex items-center gap-4 text-accent mb-4"><Activity size={28} /></div>
                    <p className="text-secondary-dim text-lg leading-relaxed">AI-guided case taking that adapts to your symptoms and asks relevant follow-up questions.</p>
                </Card>
                <Card title="Personalized Remedies">
                    <div className="flex items-center gap-4 text-purple-400 mb-4"><Microscope size={28} /></div>
                    <p className="text-secondary-dim text-lg leading-relaxed">Get tailored homeopathic remedy suggestions based on classical principles and AI analysis.</p>
                </Card>
                <Card title="Safe Learning">
                    <div className="flex items-center gap-4 text-emerald-400 mb-4"><ShieldCheck size={28} /></div>
                    <p className="text-secondary-dim text-lg leading-relaxed">Educational tool with built-in disclaimers and guidance for responsible homeopathy exploration.</p>
                </Card>
            </div>
        </motion.div>
    );
};

export default Landing;
