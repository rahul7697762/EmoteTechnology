import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, Clock, Filter } from 'lucide-react';
import { useState } from 'react';

const courses = [
    {
        title: "Full Stack Web Development",
        category: "Development",
        rating: 4.8,
        students: "1.2k",
        duration: "12 Weeks",
        image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=800",
        tags: ["React", "Node.js", "MongoDB"]
    },
    {
        title: "Data Science & AI Bootcamp",
        category: "Development",
        rating: 4.9,
        students: "850",
        duration: "16 Weeks",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
        tags: ["Python", "TensorFlow", "ML"]
    },
    {
        title: "UI/UX Design Masterclass",
        category: "Design",
        rating: 4.7,
        students: "2.1k",
        duration: "8 Weeks",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
        tags: ["Figma", "Design", "Prototyping"]
    },
    {
        title: "Strategic HR Management",
        category: "HR",
        rating: 4.6,
        students: "500+",
        duration: "6 Weeks",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
        tags: ["Recruitment", "Culture", "People Ops"]
    },
    {
        title: "Digital Marketing Mastery",
        category: "Marketing",
        rating: 4.8,
        students: "1.5k",
        duration: "10 Weeks",
        image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=800",
        tags: ["SEO", "Social Media", "Analytics"]
    },
    {
        title: "B2B Sales Excellence",
        category: "Sales",
        rating: 4.9,
        students: "900+",
        duration: "5 Weeks",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
        tags: ["Negotiation", "CRM", "Closing"]
    }
];

const categories = ["All", "Development", "Design", "Business", "Marketing", "Sales", "HR"];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

const Courses = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredCourses = selectedCategory === "All"
        ? courses
        : courses.filter(course => course.category === selectedCategory);

    return (
        <section className="py-24 px-6 lg:px-8 bg-gray-50 dark:bg-[#0a0a0f]/50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Popular <span className="text-teal-500">Courses</span></h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl">Master in-demand skills with our top-rated programs across various domains.</p>
                    </div>

                    <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="flex gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                                            : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-teal-500 dark:hover:text-teal-400'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <motion.div
                    layout
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                layout
                                key={course.title}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                className="group bg-white dark:bg-[#111116] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <motion.img
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                        {course.rating}
                                    </div>
                                    <div className="absolute top-4 left-4 bg-teal-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide">
                                        {course.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {course.tags.map(tag => (
                                            <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-teal-500 transition-colors line-clamp-1">{course.title}</h3>
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/5 pt-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={16} />
                                            <span>{course.students} students</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                            <Filter size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No courses found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try selecting a different category.</p>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <button className="px-8 py-3 rounded-full border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all font-medium">
                        View All Courses
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Courses;
