import React, { useEffect, useState } from 'react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Award, Download, Calendar, Search, Filter } from 'lucide-react';

const StudentCertificates = () => {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');

                const response = await axios.get(`${apiUrl}/student/certificates`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setCertificates(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch certificates", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const filteredCertificates = certificates.filter(cert =>
        cert.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans flex">
            <StudentSidebar />

            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Certificates</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and download your earned certificates</p>
                </header>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search certificates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1a1c23] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCertificates.map(cert => (
                            <div key={cert.id} className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group">
                                {/* Certificate Preview Area */}
                                <div className="h-48 bg-gradient-to-br from-teal-500/10 to-blue-500/10 flex items-center justify-center relative p-6 border-b border-gray-100 dark:border-gray-800">
                                    <div className="border-4 border-teal-500/20 rounded-lg w-full h-full flex flex-col items-center justify-center bg-white dark:bg-[#1a1c23] shadow-sm p-4 text-center">
                                        <Award size={32} className="text-teal-500 mb-2" />
                                        <h4 className="font-serif font-bold text-gray-900 dark:text-white text-sm line-clamp-2">{cert.courseName}</h4>
                                        <div className="w-12 h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">Certificate of Completion</p>
                                    </div>

                                    {/* Overlay Action */}
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <Eye size={16} />
                                            View Full
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Issued On</p>
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                                                <Calendar size={14} className="text-teal-500" />
                                                {cert.issueDate}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Grade</p>
                                            <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-md">
                                                {cert.grade}%
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20">
                                        <Download size={16} />
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#1a1c23] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Award size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No certificates yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                            Complete courses and pass assessments to earn certificates.
                        </p>
                        <button
                            onClick={() => window.location.href = '/student-courses'}
                            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-teal-500/20"
                        >
                            Go to My Courses
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

// Start Icon for button
function Eye(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}

export default StudentCertificates;
