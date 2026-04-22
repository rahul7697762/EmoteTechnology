import { Helmet } from 'react-helmet-async';
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
            <Helmet>
                <title>Emote Technology | Industry-Focused Tech Courses & Internships in India</title>
                <meta name="description" content="India's leading EdTech platform offering career-focused tech courses, industry internships, AI-powered interview prep, and hands-on mentorship. Build real-world skills and become job-ready." />
                <link rel="canonical" href="https://emotetechnology.in/" />
                <meta property="og:title" content="Emote Technology | Industry-Focused Tech Courses & Internships" />
                <meta property="og:description" content="India's leading EdTech platform offering career-focused tech courses, industry internships, AI interview prep, and hands-on mentorship." />
                <meta property="og:url" content="https://emotetechnology.in/" />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "EducationalOrganization",
                    "name": "Emote Technology",
                    "url": "https://emotetechnology.in",
                    "description": "India's leading EdTech platform offering career-focused tech courses, industry internships, AI-powered interview preparation, and hands-on mentorship.",
                    "foundingDate": "2021",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "DSS-15, Trishala City Road, Behind Gopal Sweets",
                        "addressLocality": "Zirakpur",
                        "addressRegion": "Punjab",
                        "postalCode": "140603",
                        "addressCountry": "IN"
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+91-8757363225",
                        "email": "hr@emotetechnology.in",
                        "contactType": "customer support"
                    }
                })}</script>
            </Helmet>
            <Background />
            <Navbar />
            <Hero />
            <Courses />
            <Jobs />
            {/* <UniversityCollabs />
            <CompanyCollabs /> */}
            <AboutUs />
            {/* Extra padding on mobile so nothing hides behind the bottom tab bar */}
            <div className="md:hidden h-16" />
            <Footer />
        </div>
    );
};

export default LandingPage;
