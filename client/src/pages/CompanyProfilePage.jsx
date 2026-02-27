import React from 'react';
import CompanyLayout from '../components/company-dashboard/CompanyLayout';
import CompanyProfile from './job-portal/CompanyProfile';

const CompanyProfilePage = () => {
  return (
    <CompanyLayout>
      <CompanyProfile />
    </CompanyLayout>
  );
};

export default CompanyProfilePage;
