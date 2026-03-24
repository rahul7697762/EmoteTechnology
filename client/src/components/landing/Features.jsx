import { motion } from 'framer-motion';
import { Globe, Award, CheckCircle } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const features = [
    {
        number: '01',
        icon: Globe,
        title: 'Learn Anywhere',
        description: 'Access courses on any device. Download for offline learning. Learn at your own pace, on your schedule.',
    },
    {
        number: '02',
        icon: Award,
        title: 'Get Certified',
        description: 'Earn industry-recognized certificates. Showcase your skills and stand out to top employers worldwide.',
    },
    {
        number: '03',
        icon: CheckCircle,
        title: 'Hands-on Projects',
        description: 'Build real-world projects. Practice with interactive labs. Grow a portfolio that speaks for itself.',
    },
];

const Features = () => {
    return (
        <section className="relative py-32 px-6 lg:px-8 border-t border-[#1A1510]/10 dark:border-[#EDE8DF]/8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
                    <div>
                        <div
                            className="text-[10px] tracking-[0.28em] uppercase text-[#C17A0A] dark:text-[#E8970E] mb-6"
                            style={{ fontFamily: MONO }}
                        >
                            02 / Why Choose Us
                        </div>
                        <h2
                            className="leading-[0.93]"
                            style={{ fontFamily: SERIF, fontSize: 'clamp(2.4rem,5vw,4.2rem)' }}
                        >
                            <span className="block font-semibold text-[#1A1510] dark:text-[#EDE8DF]">
                                Everything You Need
                            </span>
                            <span className="block font-light italic text-[#C17A0A] dark:text-[#E8970E]">
                                to Excel.
                            </span>
                        </h2>
                    </div>
                    <p className="hidden lg:block text-[#6B6157] dark:text-[#9E9589] font-light max-w-xs text-right text-sm leading-relaxed">
                        Our platform provides all the tools and resources you need to master new skills and advance your career.
                    </p>
                </div>

                {/* Feature rows */}
                <div className="border-t border-[#1A1510]/10 dark:border-[#EDE8DF]/8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true }}
                            className="group grid grid-cols-[3rem_1fr] lg:grid-cols-[100px_1fr_1fr] gap-6 lg:gap-16 py-10 border-b border-[#1A1510]/10 dark:border-[#EDE8DF]/8 -mx-4 px-4 hover:bg-[#C17A0A]/3 dark:hover:bg-[#E8970E]/3 transition-colors cursor-default"
                        >
                            {/* Number */}
                            <div
                                className="text-sm font-bold text-[#C17A0A]/35 dark:text-[#E8970E]/25 group-hover:text-[#C17A0A] dark:group-hover:text-[#E8970E] transition-colors pt-1"
                                style={{ fontFamily: MONO }}
                            >
                                {feature.number}
                            </div>

                            {/* Title + icon */}
                            <div className="flex items-start gap-4">
                                <feature.icon
                                    size={21}
                                    className="text-[#C17A0A] dark:text-[#E8970E] mt-1 shrink-0"
                                />
                                <h3
                                    className="font-semibold text-[#1A1510] dark:text-[#EDE8DF] leading-tight"
                                    style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}
                                >
                                    {feature.title}
                                </h3>
                            </div>

                            {/* Description */}
                            <p className="text-[#6B6157] dark:text-[#9E9589] font-light leading-relaxed text-sm lg:text-base lg:col-start-2 lg:col-span-1 lg:pl-[2.625rem]">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
