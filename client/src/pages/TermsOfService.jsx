import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        className="mb-4"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back
                    </Button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                            <FileText className="text-accent" size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold text-white">Terms of Service</h1>
                            <p className="text-secondary-dim">Last Updated: January 23, 2026</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="glass-panel rounded-3xl border border-white/10 p-8 space-y-6 text-secondary-dim">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Dhanwantari ("the Service"), you accept and agree to be bound by the terms
                            and provision of this agreement. If you do not agree to these Terms of Service, please do not use
                            the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">2. Description of Service</h2>
                        <p className="mb-2">
                            Dhanwantari is an AI-powered educational platform that provides preliminary homeopathic guidance
                            using Google Gemini AI technology. The Service includes:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>AI-guided symptom analysis</li>
                            <li>Preliminary remedy suggestions based on homeopathic principles</li>
                            <li>Consultation history tracking</li>
                            <li>Educational resources about homeopathy</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">3. Medical Disclaimer</h2>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                            <p className="font-semibold text-yellow-500 mb-2">⚠️ Important Medical Notice</p>
                            <p className="mb-2">
                                <strong>Dhanwantari is NOT a medical service and does NOT provide medical advice, diagnosis,
                                    or treatment.</strong> The Service is for educational and informational purposes only.
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>AI-generated recommendations are preliminary and require professional validation</li>
                                <li>Always consult a licensed healthcare provider for medical decisions</li>
                                <li>Do not use this Service for medical emergencies</li>
                                <li>Do not delay seeking medical advice based on information from this Service</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">4. User Responsibilities</h2>
                        <p className="mb-2">You agree to:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Provide accurate and complete information during consultations</li>
                            <li>Maintain the confidentiality of your account credentials</li>
                            <li>Use the Service only for lawful purposes</li>
                            <li>Not attempt to circumvent any security features</li>
                            <li>Not use the Service to harm others or violate their rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">5. Intellectual Property</h2>
                        <p>
                            All content, features, and functionality of the Service, including but not limited to text,
                            graphics, logos, and software, are owned by Dhanwantari or its licensors and are protected by
                            copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">6. Privacy and Data Protection</h2>
                        <p>
                            Your use of the Service is also governed by our Privacy Policy. We collect, use, and protect
                            your personal information as described in our{' '}
                            <a href="/privacy" className="text-accent hover:text-accent-glow underline">
                                Privacy Policy
                            </a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">7. Limitation of Liability</h2>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <p className="mb-2">
                                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, DHANWANTARI SHALL NOT BE LIABLE FOR ANY
                                    INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS
                                    OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL,
                                    OR OTHER INTANGIBLE LOSSES.</strong>
                            </p>
                            <p>
                                You acknowledge that AI-generated recommendations may contain errors and should not be relied
                                upon as a substitute for professional medical advice.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">8. Account Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account at any time for violations of these
                            Terms of Service or for any other reason at our sole discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">9. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms of Service at any time. We will notify users of any
                            material changes via email or through the Service. Your continued use of the Service after such
                            modifications constitutes your acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">10. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <div className="mt-2 ml-4">
                            <p>Email: legal@dhanwantari.com</p>
                            <p>Website: www.dhanwantari.com</p>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-white/10 text-sm text-secondary-dim/70">
                        <p>
                            By using Dhanwantari, you acknowledge that you have read, understood, and agree to be bound by
                            these Terms of Service.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsOfService;
