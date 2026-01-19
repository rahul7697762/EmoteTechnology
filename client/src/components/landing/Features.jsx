import { motion } from 'framer-motion';
import { Globe, Award, CheckCircle } from 'lucide-react';

const Features = () => {
    return (
        <section className="relative py-24 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        Everything You Need to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400">
                            Excel
                        </span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Our platform provides all the tools and resources you need to master new skills and advance your career.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Globe,
                            title: 'Learn Anywhere',
                            description: 'Access courses on any device. Download for offline learning. Learn at your own pace.',
                            gradient: 'from-blue-500 to-cyan-500',
                            iconColor: '#3b82f6',
                        },
                        {
                            icon: Award,
                            title: 'Get Certified',
                            description: 'Earn industry-recognized certificates. Showcase your skills. Stand out to employers.',
                            gradient: 'from-purple-500 to-pink-500',
                            iconColor: '#a855f7',
                        },
                        {
                            icon: CheckCircle,
                            title: 'Hands-on Projects',
                            description: 'Build real-world projects. Practice with interactive labs. Build your portfolio.',
                            gradient: 'from-orange-500 to-red-500',
                            iconColor: '#f97316',
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 hover:border-teal-200 dark:hover:border-white/20 transition-all text-center shadow-xl shadow-gray-200/50 dark:shadow-none"
                        >
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-5 dark:opacity-10 blur-3xl group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity`}></div>
                            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                <feature.icon size={28} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
