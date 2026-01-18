import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome } from 'lucide-react';
import './Login.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Login functionality would be connected to backend here!');
        }, 1500);
    };

    return (
        <div className="login-container">
            {/* Left side - Branding/Hero */}
            <div className="login-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <div className="brand-logo">
                        <span className="brand-highlight">Emote</span>Technology
                    </div>
                    <h1>Unlock Your Potential</h1>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Join our leading learning management system similar to Udemy.
                        Access world-class courses and expert instructors.
                    </p>

                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/online-learning-illustration-download-in-svg-png-gif-file-formats--education-study-school-student-digital-marketing-pack-business-illustrations-4277713.png"
                        alt="Learning Illustration"
                        className="hero-image"
                    />
                </motion.div>
            </div>

            {/* Right side - Login Form */}
            <div className="login-right">
                <div className="login-form-wrapper">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="brand-logo" style={{ display: 'none' }}> {/* Optional for mobile */}
                            <span className="brand-highlight">Emote</span>Technology
                        </div>

                        <header className="login-header">
                            <h2>Welcome back</h2>
                            <p>Please enter your details to sign in.</p>
                        </header>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div className="form-input-container">
                                    <Mail className="input-icon" size={20} />
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="form-input-container">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-actions">
                                <label className="remember-me">
                                    <input type="checkbox" /> Remember me
                                </label>
                                <a href="#" className="forgot-password">Forgot password?</a>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign in'}
                                {!loading && <ArrowRight size={20} />}
                            </button>
                        </form>

                        <div className="divider">
                            <span>Or continue with</span>
                        </div>

                        <div className="social-login">
                            <button className="social-btn">
                                <Chrome size={20} /> Google
                            </button>
                            <button className="social-btn">
                                <Github size={20} /> GitHub
                            </button>
                        </div>

                        <div className="auth-footer">
                            Don't have an account?
                            <a href="#">Sign up for free</a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
