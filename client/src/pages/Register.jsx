import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (window.refreshNavbar) {
                    window.refreshNavbar();
                }

                // Navigate to patient profile with reload
                window.location.href = '/profile';
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-panel p-8 rounded-3xl border border-white/10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Create Account</h2>
                        <p className="text-secondary-dim">Join Dhanwantari for personalized care</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            icon={User}
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            icon={Mail}
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />

                        <Button
                            variant="primary"
                            className="w-full py-3 flex items-center justify-center gap-2 mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Get Started'}
                            {!loading && <ArrowRight size={18} />}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-secondary-dim">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-accent hover:text-accent-glow transition-colors font-medium"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
