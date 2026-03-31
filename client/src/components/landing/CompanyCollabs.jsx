import { motion } from 'framer-motion';

const companies = ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Tesla"];
const duplicatedCompanies = [...companies, ...companies, ...companies];

const CompanyCollabs = () => {
    return (
        <section className="py-20 bg-[#EDEEFF]/60 dark:bg-[#252A41] overflow-hidden">
            <div className="max-w-7xl mx-auto text-center mb-10 px-6">
                <p className="text-sm font-semibold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-wider">Our Industry Partners</p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="flex animate-marquee whitespace-nowrap gap-16 min-w-full items-center opacity-70 hover:opacity-100 transition-opacity duration-300 py-4 reverse">
                    <div className="flex animate-marquee whitespace-nowrap gap-16 min-w-full items-center">
                        {duplicatedCompanies.map((company, index) => (
                            <div key={index} className="shrink-0 mx-8">
                                <span className="text-2xl md:text-3xl font-bold text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors cursor-default">
                                    {company}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CompanyCollabs;
