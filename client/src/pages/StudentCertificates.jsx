import React, { useEffect, useState } from 'react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyCertificates } from '../redux/slices/certificateSlice';
import api from '../utils/api';
import { Award, Download, Calendar, Search, Filter } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const StudentCertificates = () => {
    const { user } = useSelector((state) => state.auth);
    const { isSidebarCollapsed } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const { certificates, loading } = useSelector((state) => state.certificate);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchMyCertificates());
    }, [dispatch]);

    const filteredCertificates = certificates.filter(cert =>
        cert.courseId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] flex transition-colors duration-300">
            <StudentSidebar />

            <main className={`flex-1 p-8 lg:p-12 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <header className="mb-10 animate-in fade-in slide-in-from-top-4">
                    <h1 className="text-4xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3" style={{ fontFamily: SERIF }}>My Certificates</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>View and download your earned certificates</p>
                </header>

                {/* Search */}
                <div className="mb-8 animate-in fade-in slide-in-from-top-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8] dark:text-[#6C7EF5]" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH CERTIFICATES..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none bg-white dark:bg-[#1A1D2E] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-all text-[10px] font-bold tracking-widest text-[#1A1D2E] dark:text-[#E8EAF2] placeholder:text-[#6B7194] dark:placeholder:text-[#8B90B8]"
                            style={{ fontFamily: MONO }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="w-12 h-12 border-[3px] border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 border-t-[#3B4FD8] dark:border-t-[#6C7EF5] rounded-none animate-spin"></div>
                    </div>
                ) : filteredCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
                        {filteredCertificates.map(cert => (
                            <div key={cert._id} className="bg-white dark:bg-[#1A1D2E] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 overflow-hidden hover:shadow-md hover:border-[#3B4FD8]/30 dark:hover:border-[#6C7EF5]/30 transition-all group flex flex-col">
                                {/* Certificate Preview Area */}
                                <div className="h-56 bg-linear-to-br from-[#3B4FD8]/5 to-[#6C7EF5]/5 flex items-center justify-center relative p-8 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shrink-0">
                                    <div className="border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none w-full h-full flex flex-col items-center justify-center bg-white dark:bg-[#252A41] shadow-sm p-6 text-center">
                                        <Award size={36} className="text-[#F5A623] mb-4" />
                                        <h4 className="font-bold text-[#1A1D2E] dark:text-[#E8EAF2] text-xl line-clamp-2 leading-tight" style={{ fontFamily: SERIF }}>{cert.courseId?.title || 'Unknown Course'}</h4>
                                        <div className="w-16 h-px bg-[#3B4FD8]/20 dark:bg-[#6C7EF5]/20 my-4"></div>
                                        <p className="text-[9px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>CERTIFICATE OF COMPLETION</p>
                                    </div>

                                    {/* Overlay Action */}
                                    <div className="absolute inset-0 bg-[#0A0B10]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => window.open(cert.certificateUrl, '_blank')}
                                            className="bg-white text-[#1A1D2E] px-6 py-3 rounded-none font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform hover:bg-[#F7F8FF]"
                                            style={{ fontFamily: MONO }}
                                        >
                                            <Download size={16} />
                                            VIEW / DOWNLOAD
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-8 flex-1">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-2" style={{ fontFamily: MONO }}>ISSUED ON</p>
                                            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: MONO }}>
                                                <Calendar size={16} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                                                {new Date(cert.issuedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-2" style={{ fontFamily: MONO }}>STATUS</p>
                                            <span className="inline-block px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold uppercase tracking-widest rounded-none" style={{ fontFamily: MONO }}>
                                                {cert.status}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.open(cert.certificateUrl, '_blank')}
                                        className="w-full py-4 rounded-none bg-[#3B4FD8] hover:bg-[#2f3fab] text-white font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-3 shadow-sm mt-auto"
                                        style={{ fontFamily: MONO }}
                                    >
                                        <Download size={16} />
                                        DOWNLOAD PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#1A1D2E] rounded-none border border-dashed border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 animate-in slide-in-from-bottom-4">
                        <div className="w-20 h-20 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/10 flex items-center justify-center mx-auto mb-6 text-[#6B7194] dark:text-[#8B90B8]">
                            <Award size={40} className="text-[#F5A623]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3" style={{ fontFamily: SERIF }}>No certificates yet</h3>
                        <p className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] max-w-md mx-auto mb-8 uppercase tracking-widest leading-loose" style={{ fontFamily: MONO }}>
                            COMPLETE COURSES AND PASS ASSESSMENTS TO EARN CERTIFICATES.
                        </p>
                        <button
                            onClick={() => window.location.href = '/student-courses'}
                            className="px-8 py-4 bg-[#3B4FD8] hover:bg-[#2f3fab] text-white rounded-none font-bold text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                            style={{ fontFamily: MONO }}
                        >
                            GO TO MY COURSES
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentCertificates;
