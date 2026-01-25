import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';

const DisclaimerModal = ({ isOpen, onAccept, onDecline }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        onClick={onDecline}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="glass-panel max-w-2xl w-full rounded-3xl border border-white/10 p-8 max-h-[80vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="text-yellow-500" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-display font-bold text-white mb-2">
                                        Medical Disclaimer
                                    </h2>
                                    <p className="text-secondary-dim text-sm">
                                        Please read carefully before proceeding
                                    </p>
                                </div>
                                <button
                                    onClick={onDecline}
                                    className="text-secondary-dim hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="space-y-4 text-secondary-dim text-sm leading-relaxed">
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                    <p className="text-yellow-500 font-semibold mb-2">⚠️ Important Notice</p>
                                    <p>
                                        Dhanwantari is an <strong>AI-powered educational tool</strong> designed to provide
                                        preliminary homeopathic guidance. It is <strong>NOT a substitute for professional
                                            medical advice, diagnosis, or treatment</strong>.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-white font-semibold mb-2">This Service Does NOT:</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Replace consultation with a licensed healthcare provider</li>
                                        <li>Provide emergency medical services</li>
                                        <li>Diagnose medical conditions</li>
                                        <li>Prescribe medications or treatments</li>
                                        <li>Guarantee accuracy of AI-generated recommendations</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-white font-semibold mb-2">You Should:</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Always consult a qualified homeopathic practitioner for proper treatment</li>
                                        <li>Seek immediate medical attention for emergencies</li>
                                        <li>Inform your doctor about any remedies you're considering</li>
                                        <li>Use this tool as a supplementary resource only</li>
                                    </ul>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                    <p className="text-red-400 font-semibold mb-2">🚨 Emergency Situations</p>
                                    <p>
                                        If you are experiencing a medical emergency (chest pain, difficulty breathing,
                                        severe bleeding, etc.), <strong>DO NOT use this service</strong>. Call emergency
                                        services immediately or visit the nearest hospital.
                                    </p>
                                </div>

                                <div className="text-xs text-secondary-dim/70 pt-4 border-t border-white/10">
                                    <p>
                                        By clicking "I Understand and Accept", you acknowledge that you have read and
                                        understood this disclaimer. You agree to use Dhanwantari for educational purposes
                                        only and accept full responsibility for any decisions made based on the information
                                        provided.
                                    </p>
                                    <p className="mt-2">
                                        For full terms, please review our{' '}
                                        <a href="/terms" className="text-accent hover:text-accent-glow underline">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="/privacy" className="text-accent hover:text-accent-glow underline">
                                            Privacy Policy
                                        </a>.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 mt-8">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={onDecline}
                                >
                                    Decline
                                </Button>
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={onAccept}
                                >
                                    I Understand and Accept
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DisclaimerModal;
