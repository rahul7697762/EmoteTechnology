import React from 'react';
import CompanyLayout from '../components/company-dashboard/CompanyLayout';
import CompanyProfile from '../components/Job-portal/pages/CompanyProfile';

const CompanyProfilePage = () => {
  return (
    <CompanyLayout>
      <CompanyProfile />
    </CompanyLayout>
  );
};

export default CompanyProfilePage;
