import { motion } from 'framer-motion';
import { BookOpen, Star, Clock } from 'lucide-react';

const courses = [
    {
        title: "Full Stack Web Development",
        rating: 4.8,
        students: "1.2k",
        duration: "12 Weeks",
        image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=800",
        tags: ["React", "Node.js", "MongoDB"]
    },
    {
        title: "Data Science & AI Bootcamp",
        rating: 4.9,
        students: "850",
        duration: "16 Weeks",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
        tags: ["Python", "TensorFlow", "ML"]
    },
    {
        title: "UI/UX Design Masterclass",
        rating: 4.7,
        students: "2.1k",
        duration: "8 Weeks",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
        tags: ["Figma", "Design", "Prototyping"]
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

const Courses = () => {
    return (
        <section className="py-24 px-6 lg:px-8 bg-gray-50 dark:bg-[#0a0a0f]/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-between items-end mb-12"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Popular <span className="text-teal-500">Courses</span></h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl">Master in-demand skills with our top-rated programs.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:block px-6 py-2 rounded-full border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all font-medium"
                    >
                        View All Courses
                    </motion.button>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {courses.map((course, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
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
                            </div>
                            <div className="p-6">
                                <div className="flex gap-2 mb-4">
                                    {course.tags.map(tag => (
                                        <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-teal-500 transition-colors">{course.title}</h3>
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
                </motion.div>

                <div className="md:hidden mt-8 text-center">
                    <button className="px-6 py-2 rounded-full border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all font-medium">
                        View All Courses
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Courses;
