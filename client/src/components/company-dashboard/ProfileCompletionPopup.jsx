import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const ProfileCompletionPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [completion, setCompletion] = useState(0);
  const { profile, isFetchingProfile } = useSelector((state) => state.company);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetchingProfile) {
      calculateCompletion();
    }
  }, [profile, isFetchingProfile]);

  const calculateCompletion = () => {
    if (!profile) {
      setCompletion(0);
      setIsVisible(true);
      return;
    }

    // Calculate completion percentage based on key fields
    const fields = [
      'companyName',
      'industry',
      'location',
      'description',
      'website',
      'contactEmail',
      'founded',
      'size',
      'headquarters'
    ];

    const completedFields = fields.filter(field => {
      const value = profile[field];
      return value && value.toString().trim() !== '';
    });

    // Bonus points for logo and images (matching the logic used in the app)
    let extras = 0;
    if (profile.logo?.url) extras += 1;
    if (profile.coverImage?.url) extras += 1;
    if (profile.socialLinks && Object.values(profile.socialLinks).some(v => v)) extras += 1;
    if (profile.benefits && profile.benefits.length > 0) extras += 1;
    if (profile.techStack && profile.techStack.length > 0) extras += 1;

    const totalPoints = fields.length + 5; // fields + 5 extras
    const score = completedFields.length + extras;

    const percentage = Math.round((score / totalPoints) * 100);
    setCompletion(Math.min(percentage, 100));

    // Always show if not 100% complete OR not marked as completed by backend
    if (percentage < 100 && !profile.completed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Note: User requested that it comes back until 100%, 
    // so we only hide it for the current component's lifecycle/mount
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-[#252A41] rounded-none shadow-sm border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 overflow-hidden"
      >
        <div className="p-1 bg-[#3B4FD8] dark:bg-[#6C7EF5]" />

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-[#1A1D2E] dark:text-[#E8EAF2] text-xl leading-tight" style={{ fontFamily: SERIF }}>
                Complete Your Profile
              </h3>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#6B7194] dark:text-[#8B90B8] mt-2" style={{ fontFamily: MONO }}>
                A complete profile attracts 3x more candidates.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-[#6B7194] dark:text-[#8B90B8] hover:text-[#E25C5C] dark:hover:text-[#E25C5C] transition-colors mt-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-2" style={{ fontFamily: MONO }}>
              <span className="text-[#3B4FD8] dark:text-[#6C7EF5]">{completion}% Complete</span>
              <span className="text-[#6B7194] dark:text-[#8B90B8]">Target: 100%</span>
            </div>
            <div className="h-1.5 w-full bg-[#F7F8FF] dark:bg-[#1A1D2E] rounded-none overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-[#3B4FD8] dark:bg-[#6C7EF5] rounded-none"
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/company/onboarding')}
            className="w-full py-3 bg-[#F5A623] dark:bg-[#F9C74F] text-white dark:text-[#1A1D2E] text-[10px] uppercase tracking-[0.2em] font-bold rounded-none hover:bg-[#d9911a] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            style={{ fontFamily: MONO }}
          >
            Finish Setup
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileCompletionPopup;
