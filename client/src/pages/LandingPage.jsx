
import Background from '../components/landing/Background';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Courses from '../components/landing/Courses';
import Jobs from '../components/landing/Jobs';
import UniversityCollabs from '../components/landing/UniversityCollabs';
import CompanyCollabs from '../components/landing/CompanyCollabs';
import AboutUs from '../components/landing/AboutUs';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] overflow-x-hidden transition-colors duration-300">
            <Background />
            <Navbar />
            <Hero />
            <Courses />
            <Jobs />
            <UniversityCollabs />
            <CompanyCollabs />
            <AboutUs />
            {/* Extra padding on mobile so nothing hides behind the bottom tab bar */}
            <div className="md:hidden h-16" />
            <Footer />
        </div>
    );
};

export default LandingPage;
