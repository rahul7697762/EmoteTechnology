import React from 'react';
import CompanyLayout from '../components/company-dashboard/CompanyLayout';
import ManageApplicants from '../components/Job-portal/pages/ManageApplicants';

const CompanyApplicantsPage = () => {
  return (
    <CompanyLayout>
      <ManageApplicants />
    </CompanyLayout>
  );
};

export default CompanyApplicantsPage;
