import { motion } from 'framer-motion';

const universities = ["Lovely Professional University", "Chandigarh University", "Panjab University", "Delhi University", "Amity University"];
const duplicatedUniversities = [...universities, ...universities, ...universities];

const UniversityCollabs = () => {
    return (
        <section className="py-20 border-t border-[#3B4FD8]/8 dark:border-[#6C7EF5]/6 bg-[#F7F8FF] dark:bg-[#1A1D2E] overflow-hidden">
            <div className="max-w-7xl mx-auto text-center mb-10 px-6">
                <p className="text-sm font-semibold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-wider">Trusted by Leading Universities</p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="flex animate-marquee whitespace-nowrap gap-16 min-w-full items-center opacity-70 hover:opacity-100 transition-opacity duration-300 py-4">
                    {duplicatedUniversities.map((uni, index) => (
                        <div key={index} className="shrink-0 mx-8">
                            <span className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B4FD8] to-[#6C7EF5] cursor-default">
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
