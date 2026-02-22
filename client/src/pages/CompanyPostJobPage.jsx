import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import CompanyLayout from '../components/company-dashboard/CompanyLayout';
import PostJob from './job-portal/PostJob';

const CompanyPostJobPage = () => {
  const [searchParams] = useSearchParams();
  // Support edit mode if 'edit' param is present or if route is different (handled in App.jsx usually)
  // But PostJob expects `editMode` and `jobId` props.
  // If this page handles /company/job/edit/:id, we need useParams.
  // For now, let's assume standard Post Job.
  // If it's editing, we need to extract ID. 

  // Actually, App.jsx will likely have a separate route for edit: /company/job/edit/:id
  // So we might need two components or one flexible one.
  // Let's make this flexible in App.jsx and just pass props here if needed, but for now just render PostJob.
  // PostJob uses `useParams` internally? Let's check.
  // PostJob accepts { editMode, jobId } as props. It does NOT use useParams for jobId apparently, based on my reading of lines 14.
  // "const PostJob = ({ editMode, jobId }) => {"
  // So we need to parse params here.

  // Wait, let's check PostJob.jsx again to be sure. 
  // It says: "const PostJob = ({ editMode, jobId }) => {"
  // It does NOT use useParams.

  // So I need to use useParams here and pass it down.

  const location = useLocation();
  const isEdit = location.pathname.includes('/edit/');
  const pathParts = location.pathname.split('/');
  const idFromPath = isEdit ? pathParts[pathParts.length - 1] : null;

  return (
    <CompanyLayout>
      <PostJob editMode={isEdit} jobId={idFromPath} />
    </CompanyLayout>
  );
};

export default CompanyPostJobPage;
