import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCompanyProfile } from "../../redux/slices/companySlice";

const ProfileCompletionPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = async () => {
    try {
      const response = await dispatch(getCompanyProfile()).unwrap();
      const profile = response.company || response;

      if (!profile) {
        setCompletion(0);
        setIsVisible(true);
        setLoading(false);
        return;
      }

      // Calculate completion percentage based on key fields
      // Total fields to check: 10
      const fields = [
        'companyName',
        'logoUrl',
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

      // Bonus points for social links or arrays
      let bonus = 0;
      if (profile.socialLinks && Object.values(profile.socialLinks).some(v => v)) bonus += 1;
      if (profile.benefits && profile.benefits.length > 0) bonus += 1;

      const totalPoints = fields.length + 2; // +2 for bonuses
      const score = completedFields.length + bonus;

      const percentage = Math.round((score / totalPoints) * 100);
      setCompletion(Math.min(percentage, 100));

      // Show popup if not 100% complete
      if (percentage < 100) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
      // Assume errors (like 404s) mean profile isn't created yet
      setCompletion(0);
      setIsVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (loading || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-1 bg-linear-to-r from-teal-500 to-cyan-500" />

        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                Complete Your Profile
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                A complete profile attracts 3x more candidates.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="text-teal-600 dark:text-teal-400">{completion}% Complete</span>
              <span className="text-gray-500 dark:text-gray-400">Target: 100%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-teal-500 to-cyan-500 rounded-full"
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/company/onboarding')}
            className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group"
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
