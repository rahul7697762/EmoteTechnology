import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative border-t border-gray-200 dark:border-white/10 py-16 px-6 lg:px-8 bg-gray-50 dark:bg-transparent transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                                <Zap size={22} className="text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Emote<span className="text-teal-500 dark:text-teal-400">Technology</span>
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-500 leading-relaxed max-w-sm">
                            Empowering the next generation of tech leaders through accessible, high-quality education.
                        </p>
                    </div>
                    {[
                        { title: 'Platform', links: ['Courses', 'Mentorship', 'Pricing', 'Enterprise'] },
                        { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
                        { title: 'Support', links: ['Help Center', 'Contact', 'Community', 'Status'] },
                    ].map((col, i) => (
                        <div key={i}>
                            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">{col.title}</h4>
                            <ul className="space-y-3">
                                {col.links.map((link, j) => (
                                    <li key={j}>
                                        <Link to="#" className="text-gray-600 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-sm">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 dark:text-gray-500 text-sm">
                        © {new Date().getFullYear()} EmoteTechnology. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-gray-600 dark:text-gray-500 text-sm">
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
