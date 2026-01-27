import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CertificateItem = ({ cert }) => (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#1a1c23] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mb-3 group hover:border-teal-200 dark:hover:border-teal-900 transition-colors cursor-pointer">
        <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 font-bold text-xs">
            PDF
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 dark:text-white text-xs truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {cert.courseName}
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Issued {cert.issueDate}</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <Download size={16} />
        </button>
    </div>
);

const RecentCertificates = () => {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');

                const response = await axios.get(`${apiUrl}/student/certificates`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    // Take only the first 2 certificates
                    setCertificates(response.data.data.slice(0, 2));
                }
            } catch (error) {
                console.error("Failed to fetch certificates", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    if (loading) {
        return (
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/20 rounded-2xl animate-pulse">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/20 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Certificates</h3>
                <span className="bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400 p-1 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
                </span>
            </div>

            {certificates.length > 0 ? (
                certificates.map(cert => (
                    <CertificateItem key={cert.id} cert={cert} />
                ))
            ) : (
                <p className="text-xs text-center text-gray-500 py-4">No certificates earned yet.</p>
            )}

            <button
                onClick={() => navigate('/student-certificates')}
                className="w-full mt-2 py-2 bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                View All
            </button>
        </div>
    );
};

export default RecentCertificates;
