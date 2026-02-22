import React from 'react';
import CompanyLayout from '../components/company-dashboard/CompanyLayout';
import CompanyOnboarding from '../components/Job-portal/components/CompanyOnboarding';
import { useNavigate } from 'react-router-dom';

const CompanyOnboardingPage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/company/dashboard');
  };

  return (
    <CompanyLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Complete Your Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Setup your company profile to start posting jobs and attracting talent.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <CompanyOnboarding onComplete={handleComplete} />
      </div>
    </CompanyLayout>
  );
};

export default CompanyOnboardingPage;
