import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCertificates } from '../../redux/slices/certificateSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { Download, Award } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const CertificateItem = ({ cert }) => (
    <div className="flex items-center gap-4 p-4 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm mb-4 group hover:border-[#3B4FD8]/30 dark:hover:border-[#6C7EF5]/30 transition-colors cursor-pointer rounded-none">
        <div className="w-12 h-12 bg-[#E25C5C]/10 flex items-center justify-center text-[#E25C5C] font-bold text-[10px] uppercase tracking-widest rounded-none border border-[#E25C5C]/20 shrink-0" style={{ fontFamily: MONO }}>
            PDF
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[#1A1D2E] dark:text-[#E8EAF2] text-base truncate group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors" style={{ fontFamily: SERIF }}>
                {cert.courseId?.title || 'Unknown Course'}
            </h4>
            <p className="text-[10px] text-[#6B7194] dark:text-[#8B90B8] font-bold uppercase tracking-widest mt-1" style={{ fontFamily: MONO }}>
                ISSUED {new Date(cert.issuedAt).toLocaleDateString()}
            </p>
        </div>
        <button
            onClick={(e) => { e.stopPropagation(); window.open(cert.certificateUrl, '_blank'); }}
            className="p-3 text-[#6B7194] hover:text-[#3B4FD8] dark:text-[#8B90B8] dark:hover:text-[#6C7EF5] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors border border-transparent"
            title="Download Certificate"
        >
            <Download size={18} />
        </button>
    </div>
);

const RecentCertificates = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { certificates, loading } = useSelector((state) => state.certificate);

    useEffect(() => {
        dispatch(fetchMyCertificates());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="mb-8 p-6 flex justify-center">
                 <div className="w-6 h-6 border-[3px] border-[#3B4FD8]/20 border-t-[#3B4FD8] dark:border-[#6C7EF5]/20 dark:border-t-[#6C7EF5] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="mb-8 p-6 lg:p-8 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm rounded-none">
            <div className="flex items-center justify-between mb-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-4">
                <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Recent Certificates</h3>
                <span className="bg-[#F5A623]/10 text-[#F5A623] p-2 rounded-none">
                    <Award size={20} strokeWidth={2} />
                </span>
            </div>

            {certificates.length > 0 ? (
                certificates.slice(0, 2).map(cert => (
                    <CertificateItem key={cert._id} cert={cert} />
                ))
            ) : (
                <div className="p-6 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-center mb-6">
                    <p className="text-[10px] text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>No certificates earned yet.</p>
                </div>
            )}

            <button
                onClick={() => navigate('/student-certificates')}
                className="w-full py-4 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#1A1D2E] dark:text-[#E8EAF2] text-[10px] uppercase tracking-widest font-bold hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors rounded-none"
                style={{ fontFamily: MONO }}
            >
                View All
            </button>
        </div>
    );
};

export default RecentCertificates;
