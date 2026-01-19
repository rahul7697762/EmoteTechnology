
import Background from '../components/landing/Background';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-300">
            <Background />
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <CTA />
            <Footer />
        </div>
    );
};

export default LandingPage;
