import React from 'react';
import CompanyLayout from '../components/company-dashboard/CompanyLayout';
import JobDashboard from '../components/Job-portal/components/JobDashboard';
import ProfileCompletionPopup from '../components/company-dashboard/ProfileCompletionPopup';

const CompanyDashboard = () => {
  return (
    <CompanyLayout>
      <JobDashboard />
      <ProfileCompletionPopup />
    </CompanyLayout>
  );
};

export default CompanyDashboard;
