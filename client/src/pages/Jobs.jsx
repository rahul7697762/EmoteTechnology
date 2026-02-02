import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';

const Jobs = () => {
    const jobs = [
        {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            location: 'Remote',
            type: 'Full-time',
            salary: '$120k - $150k'
        },
        {
            id: 2,
            title: 'Product Designer',
            company: 'Creative Studio',
            location: 'New York, NY',
            type: 'Contract',
            salary: '$80k - $100k'
        },
        {
            id: 3,
            title: 'Machine Learning Engineer',
            company: 'DataFlow Systems',
            location: 'San Francisco, CA',
            type: 'Full-time',
            salary: '$160k - $200k'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />
            <main className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                        Find Your Dream Job
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Explore opportunities from top tier companies.
                    </p>
                </div>

                <div className="space-y-6">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-lg transition-all cursor-pointer group">
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-teal-500 transition-colors">{job.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">{job.company}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                                    <span className="flex items-center gap-1"><Briefcase size={16} /> {job.type}</span>
                                    <span className="flex items-center gap-1"><DollarSign size={16} /> {job.salary}</span>
                                </div>
                            </div>
                            <button className="mt-4 md:mt-0 px-6 py-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold rounded-xl hover:bg-teal-500 hover:text-white transition-all">
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Jobs;
