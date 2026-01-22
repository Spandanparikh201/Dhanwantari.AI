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
            className="flex flex-col items-center space-y-16 md:space-y-24 w-full px-4 py-12"
        >
            {/* Hero Section */}
            <section className="text-center space-y-8 max-w-5xl relative mx-auto">

                {/* AI Badge - Purple */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-600 text-sm font-medium tracking-wide">
                    <Sparkles size={16} />
                    <span>AI-Powered Homeopathy Engine</span>
                </div>

                {/* Large Hero Text - Blue */}
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter leading-none py-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    DHANWANTARI
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-600 font-body leading-relaxed max-w-2xl mx-auto">
                    An advanced AI simulating the logic of a classical homeopath.
                </p>

                {/* CTA Button */}
                <div className="pt-4">
                    <Button
                        onClick={() => navigate('/register')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg shadow-blue-600/20 inline-flex items-center gap-2"
                    >
                        Get Started
                        <ArrowRight size={20} />
                    </Button>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
                {/* Card 1 - Purple Icon */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                        <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-gray-900 font-semibold text-lg mb-2">Advanced symptom pattern recognition using Google Gemini AI.</h3>
                    <p className="text-gray-600 text-sm">Follows traditional homeopathic principles & case-taking protocols.</p>
                </div>

                {/* Card 2 - Pink Icon */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center mb-4">
                        <Microscope className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="text-gray-900 font-semibold text-lg mb-2">Follows traditional homeopathic principles & case-taking protocols.</h3>
                    <p className="text-gray-600 text-sm">Get tailored homeopathic remedy suggestions based on classical principles.</p>
                </div>

                {/* Card 3 - Cyan Icon */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="text-gray-900 font-semibold text-lg mb-2">Learn homeopathy safely with AI guidance & instant feedback.</h3>
                    <p className="text-gray-600 text-sm">Educational tool with built-in disclaimers and responsible guidance.</p>
                </div>
            </section>

            {/* Additional Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                <Card title="Intelligent Consultation" className="border-blue-200">
                    <div className="flex items-center gap-4 text-blue-600 mb-4"><Activity size={28} /></div>
                    <p className="text-gray-600 text-lg leading-relaxed">AI-guided case taking that adapts to your symptoms and asks relevant follow-up questions.</p>
                </Card>
                <Card title="Personalized Remedies">
                    <div className="flex items-center gap-4 text-purple-600 mb-4"><Microscope size={28} /></div>
                    <p className="text-gray-600 text-lg leading-relaxed">Get tailored homeopathic remedy suggestions based on classical principles and AI analysis.</p>
                </Card>
                <Card title="Safe Learning">
                    <div className="flex items-center gap-4 text-cyan-600 mb-4"><ShieldCheck size={28} /></div>
                    <p className="text-gray-600 text-lg leading-relaxed">Educational tool with built-in disclaimers and guidance for responsible homeopathy exploration.</p>
                </Card>
            </section>
        </motion.div>
    );
};

export default Landing;
