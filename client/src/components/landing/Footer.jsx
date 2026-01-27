import { Zap, MapPin, Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative border-t border-gray-200 dark:border-white/10 py-16 px-6 lg:px-8 bg-gray-50 dark:bg-transparent transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand & Address */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                                <Zap size={22} className="text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Emote<span className="text-teal-500 dark:text-teal-400">Technology</span>
                            </span>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-teal-500 shrink-0 mt-1" />
                                <p>123 Innovation Drive, Tech Valley, CA 94043, United States</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-teal-500 shrink-0" />
                                <p>contact@emotetechnology.com</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-teal-500 shrink-0" />
                                <p>+1 (555) 123-4567</p>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Menu */}
                    <div>
                        <h4 className="font-semibold mb-6 text-gray-900 dark:text-white text-lg">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Courses', 'Jobs', 'Interview Prep', 'Policies', 'Career'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-600 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 group-hover:scale-150 transition-transform"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Icons */}
                    <div>
                        <h4 className="font-semibold mb-6 text-gray-900 dark:text-white text-lg">Connect With Us</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Follow us on social media for updates, tips and more.</p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-white/10 text-center">
                    <p className="text-gray-600 dark:text-gray-500 text-sm">
                        © {new Date().getFullYear()} EmoteTechnology. All rights reserved.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
