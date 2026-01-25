import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Role-based redirect
                const userRole = data.user.role;

                if (userRole === 'admin') {
                    window.location.href = '/admin';
                } else if (userRole === 'doctor') {
                    window.location.href = '/dashboard';
                } else {
                    // Patient
                    window.location.href = '/dashboard';
                }
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
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
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-secondary-dim">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            icon={User}
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

                        <Button
                            variant="primary"
                            className="w-full py-3 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && <ArrowRight size={18} />}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-secondary-dim">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-accent hover:text-accent-glow transition-colors font-medium"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
