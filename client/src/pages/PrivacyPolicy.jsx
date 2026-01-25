import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';

const PrivacyPolicy = () => {
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
                            <Shield className="text-accent" size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold text-white">Privacy Policy</h1>
                            <p className="text-secondary-dim">Last Updated: January 23, 2026</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="glass-panel rounded-3xl border border-white/10 p-8 space-y-6 text-secondary-dim">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">1. Introduction</h2>
                        <p>
                            Dhanwantari ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard your information when you use our AI-powered
                            homeopathy consultation service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">2. Information We Collect</h2>

                        <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.1 Personal Information</h3>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Name and email address (during registration)</li>
                            <li>Date of birth, gender, and blood group (patient profile)</li>
                            <li>Medical history, allergies, and chronic conditions</li>
                            <li>Professional credentials (for doctors)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.2 Consultation Data</h3>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Symptoms and health complaints you describe</li>
                            <li>Chat conversation history with AI</li>
                            <li>AI-generated remedy recommendations</li>
                            <li>Prescription records</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.3 Technical Information</h3>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>IP address and device information</li>
                            <li>Browser type and version</li>
                            <li>Usage data and analytics</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">3. How We Use Your Information</h2>
                        <p className="mb-2">We use your information to:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Provide AI-powered homeopathic consultations</li>
                            <li>Generate and store consultation history</li>
                            <li>Improve our AI algorithms and service quality</li>
                            <li>Communicate with you about your account</li>
                            <li>Ensure security and prevent fraud</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">4. Data Sharing and Disclosure</h2>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-3">
                            <p className="font-semibold text-blue-400 mb-2">🔒 We Do NOT Sell Your Data</p>
                            <p>
                                We will never sell your personal or medical information to third parties.
                            </p>
                        </div>

                        <p className="mb-2">We may share your information with:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li><strong>Licensed Doctors:</strong> For consultation review and validation</li>
                            <li><strong>Google Gemini AI:</strong> To process your symptoms and generate recommendations</li>
                            <li><strong>Service Providers:</strong> Hosting, analytics, and email services (under strict confidentiality)</li>
                            <li><strong>Legal Authorities:</strong> When required by law or to protect rights and safety</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">5. Data Security</h2>
                        <p className="mb-2">We implement industry-standard security measures:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Encryption of data in transit (HTTPS/TLS)</li>
                            <li>Secure password hashing (bcrypt)</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and authentication</li>
                            <li>Database encryption for sensitive information</li>
                        </ul>
                        <p className="mt-3 text-sm">
                            However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute
                            security of your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">6. Data Retention</h2>
                        <p>
                            We retain your personal information for as long as your account is active or as needed to provide
                            services. Consultation records are retained for 7 years to comply with medical record-keeping
                            regulations. You may request deletion of your account and data at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">7. Your Rights</h2>
                        <p className="mb-2">You have the right to:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Portability:</strong> Export your consultation history</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                        </ul>
                        <p className="mt-3">
                            To exercise these rights, contact us at privacy@dhanwantari.com
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">8. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar technologies to enhance user experience, analyze usage patterns, and
                            maintain session security. You can control cookie preferences through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">9. Third-Party Services</h2>
                        <p className="mb-2">Our Service integrates with:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li><strong>Google Gemini AI:</strong> For AI-powered consultations (subject to Google's privacy policy)</li>
                            <li><strong>Analytics Services:</strong> To improve service quality</li>
                        </ul>
                        <p className="mt-3">
                            These third parties have their own privacy policies. We encourage you to review them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">10. Children's Privacy</h2>
                        <p>
                            Our Service is not intended for children under 18. We do not knowingly collect personal information
                            from children. If you believe we have collected data from a child, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">11. International Data Transfers</h2>
                        <p>
                            Your information may be transferred to and processed in countries other than your own. We ensure
                            appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">12. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any material changes
                            via email or through the Service. Your continued use after such changes constitutes acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">13. Contact Us</h2>
                        <p className="mb-2">
                            If you have questions or concerns about this Privacy Policy, please contact us:
                        </p>
                        <div className="mt-2 ml-4">
                            <p>Email: privacy@dhanwantari.com</p>
                            <p>Data Protection Officer: dpo@dhanwantari.com</p>
                            <p>Website: www.dhanwantari.com</p>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-white/10 text-sm text-secondary-dim/70">
                        <p>
                            By using Dhanwantari, you acknowledge that you have read and understood this Privacy Policy and
                            consent to the collection, use, and disclosure of your information as described herein.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicy;
