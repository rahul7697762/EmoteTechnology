// job-portal/pages/PostJob.jsx — Tech-Brutalism Design
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Briefcase, Save, Plus, Trash2, Building2,
  DollarSign, MapPin, Calendar, FileText, Users,
  Clock, CheckCircle, AlertCircle, Eye, Zap
} from 'lucide-react';
import { jobAPI, companyAPI } from '../services/api';
import { showToast } from '../services/toast';
import { useSelector } from 'react-redux';

const MONO = "'Space Mono', 'IBM Plex Mono', monospace";

const PostJob = ({ editMode, jobId }) => {
  const { user: _user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const role = _user?.role || '';
  const isEmployer = ['COMPANY', 'EMPLOYER', 'ADMIN'].includes(role.toUpperCase());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [companyProfile, setCompanyProfile] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    location: '',
    remote: false,
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    category: '',
    tags: [],
    deadline: '',
    applicationInstructions: '',
    hiringProcess: '',
    featured: false,
    urgent: false,
    applicationQuestions: [],
    showQuestions: true,
    visibility: 'PUBLIC',
  });

  const [newTag, setNewTag] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Volunteer'];
  const experienceLevels = ['Intern', 'Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];
  const categories = [
    'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations',
    'Finance', 'Human Resources', 'Customer Support', 'Legal', 'Other'
  ];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY', 'CNY'];

  const fetchCompanyProfile = useCallback(async () => {
    try {
      const response = await companyAPI.getProfile();
      setCompanyProfile(response.data);
      if (response.data.location && !formData.location) {
        setFormData(prev => ({ ...prev, location: response.data.location }));
      }
    } catch (err) {
      console.error('Error fetching company profile:', err);
      showToast.error('Please complete your company profile first');
      navigate('/company/profile');
    }
  }, [formData.location, navigate]);

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobById(jobId);
      const job = response.data;
      setFormData({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || '',
        responsibilities: job.responsibilities || '',
        benefits: job.benefits || '',
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        salaryCurrency: job.salaryCurrency || 'USD',
        location: job.location || '',
        remote: job.remote || false,
        jobType: job.jobType || 'Full-time',
        experienceLevel: job.experienceLevel || 'Mid-level',
        category: job.category || '',
        tags: job.tags || [],
        deadline: job.deadline ? job.deadline.substring(0, 10) : '',
        applicationInstructions: job.applicationInstructions || '',
        hiringProcess: job.hiringProcess || '',
        featured: job.featured || false,
        urgent: job.urgent || false,
        applicationQuestions: job.applicationQuestions || [],
        showQuestions: job.showQuestions !== undefined ? job.showQuestions : true,
        visibility: job.visibility || 'PUBLIC',
      });
    } catch (err) {
      showToast.error('Failed to load job details');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (!isEmployer) { navigate('/login'); return; }
    fetchCompanyProfile();
    if (editMode && jobId) fetchJobDetails();
  }, [editMode, jobId, fetchCompanyProfile, fetchJobDetails, isEmployer, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && formData.tags.length < 10) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && formData.applicationQuestions.length < 5) {
      setFormData(prev => ({ ...prev, applicationQuestions: [...prev.applicationQuestions, newQuestion.trim()] }));
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (index) => {
    setFormData(prev => ({ ...prev, applicationQuestions: prev.applicationQuestions.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyProfile) {
      setError('Please complete your company profile first');
      showToast.error('Complete company profile required');
      return;
    }
    if (!companyProfile.completed) {
      setError('Your company profile is incomplete.');
      showToast.error('Incomplete company profile');
      navigate('/company/onboarding');
      return;
    }
    if (!formData.title.trim()) { setError('Job title is required'); return; }
    if (!formData.description.trim()) { setError('Job description is required'); return; }
    if (!formData.requirements.trim()) { setError('Requirements are required'); return; }
    setSaving(true);
    setError('');
    try {
      let createdJobId = null;
      if (editMode) {
        const res = await jobAPI.updateJob(jobId, formData);
        createdJobId = res.data?.job?._id || jobId;
        showToast.success('Job updated successfully!');
      } else {
        const res = await jobAPI.createJob(formData);
        createdJobId = res.data?.job?._id;
        showToast.success('Job posted successfully!');
      }
      setTimeout(() => {
        if (createdJobId) navigate(`/company/jobs/${createdJobId}`);
        else navigate('/company/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
      showToast.error('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      showToast.success('Draft saved successfully');
    } catch (err) {
      showToast.error('Failed to save draft');
    }
  };

  /* ── Brutalism helpers ── */
  const inputCls = `w-full px-4 py-3 bg-white border-[2px] border-[#1A1D2E] text-[#1A1D2E] focus:outline-none focus:border-[#3B4FD8] focus:shadow-[inset_2px_2px_0px_rgba(59,79,216,0.12)] transition-all placeholder:text-gray-400 font-medium`;
  const selectCls = `w-full px-4 py-3 bg-white border-[2px] border-[#1A1D2E] text-[#1A1D2E] focus:outline-none focus:border-[#3B4FD8] transition-all font-medium`;
  const textareaCls = `w-full px-4 py-3 bg-white border-[2px] border-[#1A1D2E] text-[#1A1D2E] focus:outline-none focus:border-[#3B4FD8] transition-all resize-none placeholder:text-gray-400 font-medium`;
  const labelCls = `block text-xs font-black uppercase tracking-widest text-[#1A1D2E] mb-2`;
  const sectionCls = `bg-[#F7F8FF] border-[3px] border-[#1A1D2E] p-8 shadow-[6px_6px_0px_#3B4FD8]`;
  const sectionHeaderCls = `flex items-center gap-3 mb-8 pb-4 border-b-[3px] border-[#1A1D2E]`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FF] flex items-center justify-center" style={{ fontFamily: MONO }}>
        <div className="text-center">
          <div className="w-16 h-16 border-[4px] border-[#1A1D2E] border-t-[#3B4FD8] animate-spin mb-4 mx-auto" />
          <p className="font-black uppercase tracking-widest text-[#1A1D2E]">LOADING_DATA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FF] py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: MONO }}>
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#1A1D2E 1px, transparent 1px), linear-gradient(90deg, #1A1D2E 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1A1D2E] font-bold uppercase text-xs tracking-widest mb-8 hover:text-[#3B4FD8] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ← BACK
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-[4px] border-[#1A1D2E] pb-8">
            <div>
              <div className="inline-block bg-[#3B4FD8] text-white px-3 py-1 text-xs font-black uppercase tracking-widest mb-3">
                {editMode ? 'EDIT_MODE' : 'NEW_POSTING'}
              </div>
              <h1 className="text-5xl font-black uppercase text-[#1A1D2E] leading-none">
                {editMode ? 'EDIT JOB' : 'POST JOB'}
              </h1>
              <p className="text-[#1A1D2E] mt-3 font-medium text-sm opacity-60">
                {editMode ? '// UPDATE_JOB_POSTING_DETAILS' : '// FILL_DETAILS_TO_ATTRACT_BEST_CANDIDATES'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-3 border-[2px] border-[#1A1D2E] text-[#1A1D2E] font-black uppercase text-xs tracking-widest hover:bg-[#1A1D2E] hover:text-white transition-colors"
                style={{ fontFamily: MONO }}
              >
                SAVE_DRAFT
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="px-5 py-3 bg-[#1A1D2E] text-[#00E5FF] font-black uppercase text-xs tracking-widest hover:bg-[#3B4FD8] transition-colors flex items-center gap-2 border-[2px] border-[#1A1D2E]"
                style={{ fontFamily: MONO }}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'EDIT_MODE' : 'PREVIEW'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 flex items-center gap-3 bg-red-500 border-[3px] border-[#1A1D2E] p-4 shadow-[4px_4px_0px_#1A1D2E]"
          >
            <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-white font-bold text-sm uppercase tracking-wider">{error}</span>
          </motion.div>
        )}

        {/* Incomplete profile warning */}
        {companyProfile && !companyProfile.completed && (
          <div className="mb-6 flex items-start gap-3 bg-yellow-300 border-[3px] border-[#1A1D2E] p-4 shadow-[4px_4px_0px_#1A1D2E]">
            <AlertCircle className="w-5 h-5 text-[#1A1D2E] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#1A1D2E] font-bold text-sm uppercase tracking-wide">
                INCOMPLETE_PROFILE // Complete your company profile to post jobs.
              </p>
              <button
                onClick={() => navigate('/company/profile')}
                className="mt-2 text-xs font-black uppercase tracking-widest text-[#1A1D2E] underline underline-offset-4 hover:text-[#3B4FD8]"
              >
                COMPLETE_PROFILE →
              </button>
            </div>
          </div>
        )}

        {!previewMode ? (
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── SECTION 01: Basic Information ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={sectionCls}>
              <div className={sectionHeaderCls}>
                <div className="p-2 bg-[#1A1D2E] border-[2px] border-[#1A1D2E]">
                  <Briefcase className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <div>
                  <div className="text-xs text-[#3B4FD8] font-black uppercase tracking-widest">SECTION_01</div>
                  <h3 className="text-xl font-black uppercase text-[#1A1D2E]">BASIC_INFORMATION</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelCls}>JOB_TITLE *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={inputCls}
                    placeholder="e.g., Senior Frontend Developer"
                    style={{ fontFamily: MONO }}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>JOB_CATEGORY *</label>
                    <select name="category" value={formData.category} onChange={handleChange} required className={selectCls} style={{ fontFamily: MONO }}>
                      <option value="">-- SELECT --</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>JOB_TYPE *</label>
                    <select name="jobType" value={formData.jobType} onChange={handleChange} required className={selectCls} style={{ fontFamily: MONO }}>
                      {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>EXPERIENCE_LEVEL *</label>
                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required className={selectCls} style={{ fontFamily: MONO }}>
                      {experienceLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>LOCATION *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className={inputCls}
                      placeholder="e.g., San Francisco, CA"
                      style={{ fontFamily: MONO }}
                    />
                    <label className="flex items-center gap-2 mt-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="remote"
                        id="remote"
                        checked={formData.remote}
                        onChange={handleChange}
                        className="w-4 h-4 border-[2px] border-[#1A1D2E] accent-[#3B4FD8]"
                      />
                      <span className="text-xs font-black uppercase tracking-widest text-[#1A1D2E] group-hover:text-[#3B4FD8] transition-colors">
                        REMOTE_POSITION
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>SKILLS_TAGS (MAX 10)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className={inputCls}
                      placeholder="e.g., React, Node.js, AWS"
                      style={{ fontFamily: MONO }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!newTag.trim() || formData.tags.length >= 10}
                      className="px-4 py-2 bg-[#3B4FD8] text-white border-[2px] border-[#1A1D2E] hover:bg-[#1A1D2E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0px_#1A1D2E]"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1A1D2E] text-[#00E5FF] text-xs font-black uppercase tracking-widest border-[2px] border-[#1A1D2E] shadow-[2px_2px_0px_#3B4FD8]"
                          style={{ fontFamily: MONO }}
                        >
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(index)} className="hover:text-red-400 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── SECTION 02: Salary & Compensation ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={sectionCls}>
              <div className={sectionHeaderCls}>
                <div className="p-2 bg-[#1A1D2E] border-[2px] border-[#1A1D2E]">
                  <DollarSign className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <div>
                  <div className="text-xs text-[#3B4FD8] font-black uppercase tracking-widest">SECTION_02</div>
                  <h3 className="text-xl font-black uppercase text-[#1A1D2E]">SALARY_COMPENSATION</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className={labelCls}>MIN_SALARY</label>
                    <div className="flex">
                      <select
                        name="salaryCurrency"
                        value={formData.salaryCurrency}
                        onChange={handleChange}
                        className="px-2 py-3 bg-[#1A1D2E] text-[#00E5FF] border-[2px] border-[#1A1D2E] font-black text-xs focus:outline-none"
                        style={{ fontFamily: MONO }}
                      >
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        className="flex-1 min-w-0 px-4 py-3 bg-white border-[2px] border-l-0 border-[#1A1D2E] text-[#1A1D2E] focus:outline-none focus:border-[#3B4FD8] font-medium"
                        placeholder="e.g. 80000"
                        style={{ fontFamily: MONO }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>MAX_SALARY</label>
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder="e.g. 150000"
                      style={{ fontFamily: MONO }}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className={labelCls}>DEADLINE</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B4FD8] w-4 h-4 pointer-events-none" />
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        min={new Date().toLocaleDateString('en-CA')}
                        className={`${inputCls} pl-10`}
                        style={{ fontFamily: MONO }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>BENEFITS (OPTIONAL)</label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={3}
                    className={textareaCls}
                    placeholder="List the benefits offered (health insurance, remote work, flexible hours, etc.)"
                    style={{ fontFamily: MONO }}
                  />
                </div>
              </div>
            </motion.div>

            {/* ── SECTION 03: Job Description ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={sectionCls}>
              <div className={sectionHeaderCls}>
                <div className="p-2 bg-[#1A1D2E] border-[2px] border-[#1A1D2E]">
                  <FileText className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <div>
                  <div className="text-xs text-[#3B4FD8] font-black uppercase tracking-widest">SECTION_03</div>
                  <h3 className="text-xl font-black uppercase text-[#1A1D2E]">JOB_DESCRIPTION</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelCls}>DESCRIPTION *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows={8} className={textareaCls} placeholder="Describe the role, team, projects, and impact..." style={{ fontFamily: MONO }} />
                </div>
                <div>
                  <label className={labelCls}>REQUIREMENTS_QUALIFICATIONS *</label>
                  <textarea name="requirements" value={formData.requirements} onChange={handleChange} required rows={6} className={textareaCls} placeholder="List required skills, education, experience, and qualifications..." style={{ fontFamily: MONO }} />
                </div>
                <div>
                  <label className={labelCls}>RESPONSIBILITIES (OPTIONAL)</label>
                  <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows={6} className={textareaCls} placeholder="List day-to-day responsibilities and tasks..." style={{ fontFamily: MONO }} />
                </div>
              </div>
            </motion.div>

            {/* ── SECTION 04: Application Process ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={sectionCls}>
              <div className={sectionHeaderCls}>
                <div className="p-2 bg-[#1A1D2E] border-[2px] border-[#1A1D2E]">
                  <Users className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <div>
                  <div className="text-xs text-[#3B4FD8] font-black uppercase tracking-widest">SECTION_04</div>
                  <h3 className="text-xl font-black uppercase text-[#1A1D2E]">APPLICATION_PROCESS</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelCls}>APPLICATION_INSTRUCTIONS</label>
                  <textarea name="applicationInstructions" value={formData.applicationInstructions} onChange={handleChange} rows={4} className={textareaCls} placeholder="Any special instructions for applicants..." style={{ fontFamily: MONO }} />
                </div>
                <div>
                  <label className={labelCls}>HIRING_PROCESS (OPTIONAL)</label>
                  <textarea name="hiringProcess" value={formData.hiringProcess} onChange={handleChange} rows={4} className={textareaCls} placeholder="Describe your hiring process (interviews, tests, timeline)..." style={{ fontFamily: MONO }} />
                </div>

                <div>
                  <label className="flex items-center gap-3 p-4 bg-white border-[2px] border-[#1A1D2E] hover:border-[#3B4FD8] cursor-pointer transition-colors group mb-4 shadow-[2px_2px_0px_#1A1D2E]">
                    <input
                      type="checkbox"
                      name="showQuestions"
                      checked={formData.showQuestions}
                      onChange={handleChange}
                      className="w-4 h-4 border-[2px] border-[#1A1D2E] accent-[#3B4FD8]"
                    />
                    <div>
                      <div className="font-black text-[#1A1D2E] uppercase text-sm tracking-wider group-hover:text-[#3B4FD8] transition-colors">INCLUDE_CUSTOM_QUESTIONS</div>
                      <div className="text-xs text-gray-500 mt-0.5">Ask candidates specific questions to filter the best talent</div>
                    </div>
                  </label>

                  {formData.showQuestions && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={labelCls}>CUSTOM_QUESTIONS</span>
                        <span className="text-xs font-black text-[#3B4FD8]">{formData.applicationQuestions.length}/5</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
                          className={inputCls}
                          placeholder="e.g., Why do you want to join our team?"
                          style={{ fontFamily: MONO }}
                        />
                        <button
                          type="button"
                          onClick={handleAddQuestion}
                          disabled={!newQuestion.trim() || formData.applicationQuestions.length >= 5}
                          className="px-4 py-2 bg-[#3B4FD8] text-white border-[2px] border-[#1A1D2E] hover:bg-[#1A1D2E] transition-colors disabled:opacity-40 shadow-[2px_2px_0px_#1A1D2E]"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      {formData.applicationQuestions.length > 0 && (
                        <div className="space-y-2">
                          {formData.applicationQuestions.map((question, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white border-[2px] border-[#1A1D2E] hover:border-[#3B4FD8] transition-colors group">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-[#3B4FD8]">Q{index + 1}.</span>
                                <span className="text-sm font-medium text-[#1A1D2E]">{question}</span>
                              </div>
                              <button type="button" onClick={() => handleRemoveQuestion(index)} className="text-gray-400 hover:text-red-500 transition-colors ml-3 flex-shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── SECTION 05: Visibility & Options ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={sectionCls}>
              <div className={sectionHeaderCls}>
                <div className="p-2 bg-[#1A1D2E] border-[2px] border-[#1A1D2E]">
                  <Eye className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <div>
                  <div className="text-xs text-[#3B4FD8] font-black uppercase tracking-widest">SECTION_05</div>
                  <h3 className="text-xl font-black uppercase text-[#1A1D2E]">VISIBILITY_OPTIONS</h3>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>VISIBILITY</label>
                  <select name="visibility" value={formData.visibility} onChange={handleChange} className={selectCls} style={{ fontFamily: MONO }}>
                    <option value="PUBLIC">PUBLIC — Listed on job board</option>
                    <option value="UNLISTED">UNLISTED — Only via link</option>
                    <option value="DRAFT">DRAFT — Only visible to you</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>PRIORITY_FLAGS</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-white border-[2px] border-[#1A1D2E] hover:border-[#3B4FD8] cursor-pointer transition-colors group shadow-[2px_2px_0px_#1A1D2E]">
                      <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 accent-[#3B4FD8]" />
                      <div>
                        <div className="font-black text-[#1A1D2E] text-xs uppercase tracking-widest group-hover:text-[#3B4FD8] transition-colors">FEATURED_LISTING</div>
                        <div className="text-xs text-gray-500">Highlight at top of search results</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white border-[2px] border-[#1A1D2E] hover:border-red-500 cursor-pointer transition-colors group shadow-[2px_2px_0px_#1A1D2E]">
                      <input type="checkbox" name="urgent" checked={formData.urgent} onChange={handleChange} className="w-4 h-4 accent-red-500" />
                      <div>
                        <div className="font-black text-[#1A1D2E] text-xs uppercase tracking-widest flex items-center gap-2 group-hover:text-red-500 transition-colors">
                          <Zap className="w-3 h-3 text-red-500" />URGENT_HIRING
                        </div>
                        <div className="text-xs text-gray-500">Mark as urgent to attract applicants quickly</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Submit ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 border-[2px] border-[#1A1D2E] text-[#1A1D2E] font-black uppercase text-sm tracking-widest hover:bg-[#1A1D2E] hover:text-white transition-colors"
                style={{ fontFamily: MONO }}
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-3 px-8 py-4 bg-[#3B4FD8] text-white font-black uppercase text-sm tracking-widest hover:bg-[#1A1D2E] transition-colors disabled:opacity-50 border-[2px] border-[#1A1D2E] shadow-[4px_4px_0px_#1A1D2E] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                style={{ fontFamily: MONO }}
              >
                <Save className="w-5 h-5" />
                {saving ? (editMode ? 'UPDATING...' : 'POSTING...') : (editMode ? 'UPDATE_JOB' : 'POST_JOB')}
              </button>
            </motion.div>
          </form>
        ) : (
          /* ── Preview Mode ── */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${sectionCls} space-y-8`}>
            <div className="border-b-[3px] border-[#1A1D2E] pb-8">
              {formData.urgent && (
                <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 text-xs font-black uppercase tracking-widest mb-4 border-[2px] border-[#1A1D2E] mr-2">
                  <Zap className="w-3 h-3" /> URGENT
                </div>
              )}
              {formData.featured && (
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#1A1D2E] px-3 py-1 text-xs font-black uppercase tracking-widest mb-4 border-[2px] border-[#1A1D2E]">
                  FEATURED
                </div>
              )}
              <h2 className="text-4xl font-black uppercase text-[#1A1D2E] leading-none mb-4">
                {formData.title || 'JOB_TITLE_PREVIEW'}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { icon: Building2, val: companyProfile?.companyName || 'YOUR_COMPANY' },
                  { icon: MapPin, val: formData.remote ? 'REMOTE' : formData.location || 'LOCATION' },
                  { icon: Briefcase, val: formData.jobType },
                  { icon: Users, val: formData.experienceLevel },
                ].map(({ icon: Icon, val }, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D2E] text-[#F7F8FF] text-xs font-black uppercase tracking-wider border-[2px] border-[#1A1D2E]" style={{ fontFamily: MONO }}>
                    <Icon className="w-3.5 h-3.5 text-[#00E5FF]" />{val}
                  </span>
                ))}
                {(formData.salaryMin || formData.salaryMax) && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-400 text-[#1A1D2E] text-xs font-black uppercase tracking-wider border-[2px] border-[#1A1D2E]" style={{ fontFamily: MONO }}>
                    <DollarSign className="w-3.5 h-3.5" />
                    {formData.salaryMin && formData.salaryMax
                      ? `${formData.salaryCurrency} ${formData.salaryMin}–${formData.salaryMax}`
                      : 'NEGOTIABLE'}
                  </span>
                )}
              </div>
            </div>

            {formData.description && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[#3B4FD8] mb-3">// JOB_DESCRIPTION</h3>
                <div className="bg-white border-[2px] border-[#1A1D2E] p-6">
                  <p className="text-[#1A1D2E] whitespace-pre-line leading-relaxed">{formData.description}</p>
                </div>
              </div>
            )}

            {formData.requirements && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[#3B4FD8] mb-3">// REQUIREMENTS</h3>
                <div className="bg-white border-[2px] border-[#1A1D2E] p-6">
                  <p className="text-[#1A1D2E] whitespace-pre-line leading-relaxed">{formData.requirements}</p>
                </div>
              </div>
            )}

            {formData.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[#3B4FD8] mb-3">// SKILLS_REQUIRED</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#1A1D2E] text-[#00E5FF] text-xs font-black uppercase tracking-wider border-[2px] border-[#1A1D2E]" style={{ fontFamily: MONO }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t-[3px] border-[#1A1D2E]">
              <button
                onClick={() => setPreviewMode(false)}
                className="px-8 py-4 bg-[#1A1D2E] text-white font-black uppercase text-sm tracking-widest hover:bg-[#3B4FD8] transition-colors border-[2px] border-[#1A1D2E] shadow-[4px_4px_0px_#3B4FD8]"
                style={{ fontFamily: MONO }}
              >
                ← BACK_TO_EDITOR
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PostJob;