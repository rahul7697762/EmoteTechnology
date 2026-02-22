import { motion } from 'framer-motion';
import { Target, Users, Shield } from 'lucide-react';

const AboutUs = () => {
    return (
        <section className="py-24 px-6 lg:px-8 bg-white dark:bg-[#0a0a0f] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <span className="text-teal-500 font-semibold tracking-wider uppercase text-sm mb-4 block">About Us</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                            Building the Future of <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-cyan-500">Tech Education</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                            At EmoteTechnology, we believe that education should be accessible, engaging, and directly connected to industry needs. We're bridging the gap between academic learning and real-world application.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: Target, title: "Mission Driven", desc: "Empowering individuals to reach their full potential." },
                                { icon: Users, title: "Community Focused", desc: "Building a supportive network of learners and mentors." },
                                { icon: Shield, title: "Quality First", desc: "Delivering world-class curriculum and instruction." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="flex gap-4"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center shrink-0">
                                        <item.icon size={24} className="text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <motion.div
                            animate={{ rotate: [6, 0, 6] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute inset-0 bg-linear-to-br from-teal-500 to-blue-600 rounded-3xl blur-3xl opacity-20 transform rotate-6"
                        ></motion.div>
                        <motion.div
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                alt="Team collaboration"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white font-medium text-lg">"We are shaping the way the world learns."</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
