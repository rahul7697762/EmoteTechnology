import React from 'react';
import { useParams } from 'react-router-dom';
import CompanyLayout from '../components/company-dashboard/CompanyLayout';
import JobDetailPage from '../components/Job-portal/pages/JobDetailPage';

const CompanyJobDetailPage = () => {
  const { id } = useParams();
  return (
    <CompanyLayout>
      <JobDetailPage jobId={id} />
    </CompanyLayout>
  );
};

export default CompanyJobDetailPage;
