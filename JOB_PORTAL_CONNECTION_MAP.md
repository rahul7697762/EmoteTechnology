# Job Portal Component Connection Map

## ✅ Connection Flow - All Issues Fixed

### **Main Entry Point: `pages/Jobs.jsx`**
Central wrapper that manages all job portal navigation and state

```
Jobs.jsx
├── State Management:
│   ├── userType: 'jobSeeker' | 'employer'
│   ├── activeTab: Current page/section
│   └── selectedJobId: Current job being viewed
├── Callbacks:
│   ├── openJobDetail(id) → Sets activeTab='job-detail' + selectedJobId
│   ├── openApply(id) → Sets activeTab='apply' + selectedJobId
│   └── toggleUserType() → Switches between job seeker and employer
└── Rendering:
    └── renderMainContent() → Returns appropriate component based on userType + activeTab
```

---

## **JOB SEEKER FLOW** 👤

### 1. **Browse Jobs Screen**
```
JobListing Component
├── Input: onViewJob callback ✅ (FIXED - added to props)
├── Renders: JobCard[] grid
└── When clicked: Calls onViewJob(jobId) → Triggers openJobDetail
```

### 2. **Job Card Component**
```
JobCard
├── Props: job, onViewJob ✅ (FIXED - removed Link, uses callback)
├── Click Handler: onClick={() => onViewJob?.(job._id)}
└── Navigation: Calls onViewJob callback instead of <Link>
```

### 3. **Job Detail Page**
```
JobDetailPage
├── Props: jobId (from wrapper) + onApply callback ✅ (FIXED - accepts both)
├── Data Fetching: 
│   ├── fetchJobDetails() using jobId prop
│   └── checkApplicationStatus()
├── Apply Button:
│   ├── Triggers: setShowApplyForm(true)
│   ├── Shows: ApplicationForm modal
│   └── Success Handler: Calls onApply callback if provided
└── Dual Mode:
    ├── Wrapper mode: Receives jobId prop + onApply callback
    └── Standalone mode: Uses URL param (useParams)
```

### 4. **Application Form**
```
ApplicationForm
├── Props: jobId, jobTitle, companyName, onSuccess, onCancel ✅ (FIXED)
├── Job Data Fetching:
│   ├── If jobTitle/companyName not provided → Fetch from API
│   ├── Uses: jobAPI.getJobById(jobId) to get job details
│   └── Fallback: displayJobTitle, displayCompanyName
├── Form Steps: 1→2→3 (Personal Info → Resume → Cover Letter)
├── Submit:
│   ├── Calls: applicationAPI.createApplication
│   └── On Success: onSuccess() callback
└── Cancel: onCancel() callback
```

### 5. **My Applications Page**
```
MyApplications
├── Fetches: applicationAPI.getMyApplications()
├── Displays: List of user's job applications
└── Features: Status filtering, search, sorting
```

---

## **EMPLOYER FLOW** 🏢

### 1. **Dashboard**
```
JobDashboard  
├── Fetches: jobAPI.getCompanyJobs() ✅ (FIXED - uses /companies/jobs endpoint)
├── Displays:
│   ├── Company job stats
│   ├── List of posted jobs
│   └── Action buttons (edit, close, view applicants)
└── API: Uses corrected endpoint /companies/jobs (not /jobs/company)
```

### 2. **Company Profile**
```
CompanyProfile
├── Fetches: companyAPI.getProfile()
├── Actions:
│   ├── Edit company info
│   ├── Upload logo
│   └── Update contact details
└── Required for: Posting jobs
```

### 3. **Post Job Page**
```
PostJob
├── Fetches: companyAPI.getProfile() - validates company exists
├── Form:
│   ├── Job details (title, description, etc.)
│   ├── Salary range
│   ├── Requirements & responsibilities
│   ├── Application questions
│   └── Tags
├── Submit: jobAPI.createJob()
└── Success: Redirect to dashboard
```

### 4. **Manage Applicants Page**
```
ManageApplicants
├── Fetches:
│   ├── jobAPI.getCompanyJobs() - List employer's jobs
│   └── jobAPI.getJobApplications(jobId) ✅ (FIXED - params handling)
├── Job Selection: Dropdown/buttons to select which job's applicants to view
├── Filters: ✅ (FIXED - Client-side filtering)
│   ├── Status filter
│   └── Search by name/email
├── Components:
│   └── ApplicantCard
│       ├── Shows: Applicant info, resume, cover letter
│       ├── Actions:
│       │   ├── Mark as Reviewed
│       │   ├── Shortlist
│       │   └── Reject
│       └── Update: applicationAPI.updateApplicationStatus()
```

---

## **🔧 FIXES APPLIED**

### Fix #1: JobCard Navigation ✅
- **Issue**: Used `<Link to={...}>` instead of callback
- **Fix**: Changed to `onClick={() => onViewJob?.(job._id)}`
- **Removed**: React Router import

### Fix #2: JobListing Props ✅
- **Issue**: Didn't accept `onViewJob` callback
- **Fix**: Added to function signature, passed to JobCard

### Fix #3: JobDetail Component ✅
- **Issue**: Expected `job` object, got `jobId` from wrapper
- **Fix**: 
  - Accepts `jobId` prop
  - Fetches job data using `jobAPI.getJobById(jobId)`
  - Supports both wrapper mode and standalone mode
  - Added loading/error states

### Fix #4: ApplicationForm Props ✅
- **Issue**: Missing `jobTitle` and `companyName` from wrapper
- **Fix**:
  - Added `displayJobTitle` and `displayCompanyName` state
  - Fetches job data if not provided in props
  - Uses fetched data as fallback

### Fix #5: ManageApplicants API Call ✅
- **Issue**: Passed params wrong way to `getJobApplications`
- **Fix**: 
  - Changed to client-side filtering
  - Applied status and search filters after fetching data
  - Proper error handling

### Fix #6: Jobs.jsx Wrapper Callbacks ✅
- **Issue**: ApplicationForm callbacks not handled
- **Fix**:
  - Added `onSuccess` callback for both job seekers and employers
  - Added `onCancel` callback
  - Proper navigation after form submission

### Fix #7: JobDetailPage Dual Mode ✅
- **Issue**: Only worked with URL params, not props
- **Fix**:
  - Accepts `jobId` prop as alternative to URL param
  - Supports wrapper context
  - Optional `onApply` callback

---

## **API Endpoints Used**

### Job Seeker APIs
- `GET /api/jobs` - Browse all jobs (JobListing)
- `GET /api/jobs/{id}` - Get job details (JobDetailPage, ApplicationForm)
- `POST /api/applications` - Submit application (ApplicationForm)
- `GET /api/applications/my` - Get user's applications (MyApplications)
- `PATCH /api/applications/{id}/status` - Update application status (ApplicantCard)

### Employer APIs
- `GET /api/companies/jobs` ✅ **FIXED** - Get company's jobs (JobDashboard)
  - **Was**: `/api/jobs/company` (Wrong endpoint)
  - **Fixed**: Changed to `/api/companies/jobs` (Correct endpoint)
- `GET /api/companies/profile` - Get company profile (CompanyProfile, PostJob)
- `POST /api/companies/profile` - Update company profile (CompanyProfile)
- `POST /api/jobs` - Create new job (PostJob)
- `PUT /api/jobs/{id}` - Update job (PostJob edit mode)
- `PATCH /api/jobs/{id}/close` - Close a job (JobDashboard)
- `GET /api/jobs/{id}/applications` - Get job applications (ManageApplicants)

---

## **State Flow Example: Job Seeker Applying to Job**

```
1. Browse Jobs
   └─ JobListing displayed

2. Click JobCard
   └─ JobCard.onClick() 
      └─ onViewJob(jobId) 
         └─ openJobDetail(jobId)
            └─ setActiveTab('job-detail'), setSelectedJobId(jobId)

3. Job Detail View
   └─ JobDetailPage rendered with jobId prop
      └─ Fetches jobAPI.getJobById(jobId)

4. Click "Apply Now"
   └─ setShowApplyForm(true)
      └─ ApplicationForm modal displayed

5. Submit Application
   └─ applicationAPI.createApplication(...)
      └─ handleApplySuccess()
         └─ onApply() callback triggers
            └─ setActiveTab('my-applications')
            └─ setSelectedJobId(null)

6. View Applications
   └─ MyApplications page displayed
```

---

## **✨ All Components Are Now Properly Connected!**

The job portal is fully integrated with:
- ✅ Proper navigation between screens
- ✅ Correct API endpoint usage
- ✅ Proper data fetching and handling
- ✅ Callback-based component communication
- ✅ Error handling and loading states
- ✅ Both job seeker and employer workflows
