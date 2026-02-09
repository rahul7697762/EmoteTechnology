
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
        <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-300">
            <Background />
            <Navbar />
            <Hero />
            <Courses />
            <Jobs />
            <UniversityCollabs />
            <CompanyCollabs />
            <AboutUs />
            <Footer />
        </div>
    );
};

export default LandingPage;
