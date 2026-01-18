import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    Award,
    ChevronRight,
    Zap,
    Globe,
    CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-brand" onClick={() => navigate('/')}>
                    <Zap size={24} color="#19e6c4" />
                    Emote<span>Technology</span>
                </div>
                <ul className="nav-links">
                    <li className="nav-link">Home</li>
                    <li className="nav-link">Courses</li>
                    <li className="nav-link">Mentors</li>
                    <li className="nav-link">About</li>
                </ul>
                <button className="nav-cta" onClick={() => navigate('/login')}>
                    Get Started
                </button>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <motion.div
                    className="hero-content"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div className="hero-badge" variants={fadeIn}>
                        <span className="dot"></span> New Courses Available
                    </motion.div>
                    <motion.h1 className="hero-title" variants={fadeIn}>
                        Master the Skills <br /> of Tomorrow
                    </motion.h1>
                    <motion.p className="hero-description" variants={fadeIn}>
                        EmoteTechnology provides a cutting-edge learning ecosystem designed to
                        empower you with real-world skills in coding, design, and leadership.
                    </motion.p>
                    <motion.div className="hero-actions" variants={fadeIn}>
                        <button className="btn-primary" onClick={() => navigate('/login')}>
                            Start Learning <ChevronRight size={20} />
                        </button>
                        <button className="btn-secondary">
                            View Catalog
                        </button>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="hero-visual"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>

                    <motion.div
                        className="floating-card"
                        style={{ top: '-40px', right: '20px' }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                        <div className="card-icon">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h4>100+ Courses</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Updated Weekly</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="floating-card"
                        style={{ bottom: '40px', left: '-20px' }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    >
                        <div className="card-icon" style={{ color: '#ec4899' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <h4>Expert Mentors</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Learn from the best</p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stat-item">
                    <h3>10k+</h3>
                    <p>Active Learners</p>
                </div>
                <div className="stat-item">
                    <h3>200+</h3>
                    <p>Expert Instructors</p>
                </div>
                <div className="stat-item">
                    <h3>500+</h3>
                    <p>Total Courses</p>
                </div>
                <div className="stat-item">
                    <h3>4.9</h3>
                    <p>User Rating</p>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Why Choose EmoteTechnology?</h2>
                    <p className="section-subtitle">We provide a comprehensive learning experience that goes beyond video tutorials.</p>
                </div>

                <div className="features-grid">
                    <motion.div
                        className="feature-card"
                        whileHover={{ y: -5 }}
                    >
                        <div className="feature-icon">
                            <Globe size={28} />
                        </div>
                        <h3>Learn Anywhere</h3>
                        <p>Access your courses from any device, anywhere in the world. Download for offline viewing.</p>
                    </motion.div>

                    <motion.div
                        className="feature-card"
                        whileHover={{ y: -5 }}
                    >
                        <div className="feature-icon">
                            <Award size={28} />
                        </div>
                        <h3>Get Certified</h3>
                        <p>Earn industry-recognized certificates for every course you complete to showcase your skills.</p>
                    </motion.div>

                    <motion.div
                        className="feature-card"
                        whileHover={{ y: -5 }}
                    >
                        <div className="feature-icon">
                            <CheckCircle size={28} />
                        </div>
                        <h3>Hands-on Projects</h3>
                        <p>Apply what you learn with real-world projects and interactive coding environments.</p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '6rem 5%',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #fff 100%)'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Start Your Journey?</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
                    Join thousands of learners who are already transforming their careers with EmoteTechnology.
                </p>
                <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => navigate('/login')}>
                    Get Started for Free
                </button>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="nav-brand" style={{ marginBottom: '1rem' }}>
                            <Zap size={24} color="#19e6c4" />
                            Emote<span>Technology</span>
                        </div>
                        <p>Empowering the next generation of tech leaders through accessible, high-quality education.</p>
                    </div>

                    <div className="footer-col">
                        <h4>Platform</h4>
                        <ul className="footer-links">
                            <li><a href="#">Browse Courses</a></li>
                            <li><a href="#">Mentorship</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">For Business</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul className="footer-links">
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} EmoteTechnology. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
