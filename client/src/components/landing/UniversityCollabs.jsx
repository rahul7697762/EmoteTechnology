import { motion } from 'framer-motion';

const universities = ["Lovely Professional University", "Chandigarh University", "Panjab University", "Delhi University", "Amity University"];
// Duplicate the list for seamless looping
const duplicatedUniversities = [...universities, ...universities, ...universities];

const UniversityCollabs = () => {
    return (
        <section className="py-20 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0f] overflow-hidden">
            <div className="max-w-7xl mx-auto text-center mb-10 px-6">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trusted by Leading Universities</p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="flex animate-marquee whitespace-nowrap gap-16 min-w-full items-center opacity-70 hover:opacity-100 transition-opacity duration-300 py-4">
                    {duplicatedUniversities.map((uni, index) => (
                        <div key={index} className="flex-shrink-0 mx-8">
                            <span className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-white cursor-default">
                                {uni}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UniversityCollabs;
