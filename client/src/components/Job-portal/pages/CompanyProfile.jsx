// job-portal/pages/CompanyProfile.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Upload, Save, AlertCircle, Globe, Mail, Phone,
  MapPin, Facebook, Linkedin, Twitter, Instagram, Plus, Trash2, X,
  CheckCircle, FileText, Users
} from 'lucide-react';
import { companyAPI } from '../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../services/toast';
import { getCompanyProfile } from '../../../redux/slices/companySlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const CompanyProfile = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    description: '',
    website: '',
    industry: '',
    size: '',
    founded: '',
    location: '',
    headquarters: '',
    contactEmail: '',
    contactPhone: '',
    logo: null,
    logoPreview: '',
    coverImage: null,
    coverPreview: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
    },
    benefits: [],
    techStack: [],
    hiringManager: {
      name: '',
      email: '',
      phone: '',
      role: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newBenefit, setNewBenefit] = useState('');
  const [newTech, setNewTech] = useState('');

  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const role = authUser?.role || '';
    const isEmployer = ['COMPANY', 'EMPLOYER', 'ADMIN'].includes(role.toUpperCase());
    if (isEmployer) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [authUser]);

  const fetchProfile = async () => {
    try {
      const response = await companyAPI.getProfile();
      if (response.data) {
        const data = response.data;
        setFormData(prev => ({
          ...prev,
          ...data,
          logoPreview: data.logo?.url || '',
          coverPreview: data.coverImage?.url || '',
          socialLinks: data.socialLinks || prev.socialLinks,
          benefits: data.benefits || [],
          techStack: data.techStack || [],
          hiringManager: data.hiringManager || prev.hiringManager,
        }));
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        // No profile yet, just let them create it
        return;
      }
      console.error('Error fetching profile:', err);
      setError(err?.response?.data?.message || 'Failed to fetch company profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleHiringManagerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      hiringManager: {
        ...prev.hiringManager,
        [field]: value,
      },
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > (type === 'logo' ? 5 : 10) * 1024 * 1024) {
      setError(`${type === 'logo' ? 'Logo' : 'Cover'} size must be less than ${type === 'logo' ? '5MB' : '10MB'}`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        [type]: file,
        [`${type}Preview`]: reader.result, // logoPreview or coverPreview
      }));
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const addBenefit = () => {
    if (newBenefit.trim() && formData.benefits.length < 10) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addTech = () => {
    if (newTech.trim() && formData.techStack.length < 15) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()],
      }));
      setNewTech('');
    }
  };

  const removeTech = (index) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'logo') {
          if (formData.logo instanceof File) {
            submitData.append('logo', formData.logo);
          }
        } else if (key === 'coverImage') {
          if (formData.coverImage instanceof File) {
            submitData.append('coverImage', formData.coverImage);
          }
        } else if (key === 'socialLinks') {
          submitData.append('socialLinks', JSON.stringify(formData.socialLinks));
        } else if (key === 'benefits') {
          submitData.append('benefits', JSON.stringify(formData.benefits));
        } else if (key === 'techStack') {
          submitData.append('techStack', JSON.stringify(formData.techStack));
        } else if (key === 'hiringManager') {
          submitData.append('hiringManager', JSON.stringify(formData.hiringManager));
        } else if (!['logoPreview', 'coverPreview'].includes(key) && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      await companyAPI.createProfile(submitData);
      
      // Refresh the global Redux state to update header logo/name
      await dispatch(getCompanyProfile());
      
      setSuccess(true);
      showToast.success('Profile updated successfully!', { style: { borderRadius: 0, fontFamily: MONO, fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }});
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
      showToast.error('Failed to update profile', { style: { borderRadius: 0, fontFamily: MONO, fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }});
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Manufacturing', 'Media & Entertainment', 'Telecommunications',
    'Transportation', 'Real Estate', 'Hospitality', 'Energy',
    'Biotechnology', 'E-commerce', 'SaaS', 'Other'
  ];

  return (
    <div className="bg-white dark:bg-[#252A41] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm overflow-hidden">

      {/* Header with Cover Image */}
      <div className="relative h-48 bg-[#F7F8FF] dark:bg-[#1A1D2E] border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
        {formData.coverPreview ? (
          <img src={formData.coverPreview} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#6B7194] dark:text-[#8B90B8]">
            <Building2 className="w-16 h-16 opacity-30 mb-2" strokeWidth={1} />
            <span className="text-[10px] uppercase font-bold tracking-widest" style={{ fontFamily: MONO }}>Add a cover image to showcase your brand</span>
          </div>
        )}
        <label className="absolute top-4 right-4 cursor-pointer bg-white/90 dark:bg-[#1A1D2E]/90 hover:bg-[#F5A623] dark:hover:bg-[#F9C74F] hover:text-white dark:hover:text-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] px-4 py-2 rounded-none border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 backdrop-blur-sm transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>
          <Upload className="w-4 h-4" /> Change Cover
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} className="hidden" />
        </label>
      </div>

      <div className="px-4 md:px-8 pb-8">
        <div className="relative -mt-16 mb-10 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          <div className="relative group">
            <div className="w-32 h-32 rounded-none border-[6px] border-[#F7F8FF] dark:border-[#1A1D2E] bg-white dark:bg-[#252A41] shadow-sm flex items-center justify-center">
              {formData.logoPreview ? (
                <img src={formData.logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-[#6B7194] dark:text-[#8B90B8]" strokeWidth={1} />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 p-2 bg-[#F5A623] dark:bg-[#F9C74F] text-white dark:text-[#1A1D2E] rounded-none cursor-pointer border border-[#F7F8FF] dark:border-[#1A1D2E] hover:bg-[#d9911a] transition-transform hover:-translate-y-1">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="hidden" />
            </label>
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-4xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase leading-none" style={{ fontFamily: SERIF }}>
              {formData.companyName || 'Company Name'}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mt-2" style={{ fontFamily: MONO }}>
              {formData.industry || 'Industry'} <span className="text-[#3B4FD8]/50 mx-1">•</span> {formData.location || 'Location'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[#E25C5C]/10 border border-[#E25C5C]/30 flex items-center gap-3 text-[#E25C5C] animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-3 text-[#10B981] animate-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* Basic Info Section */}
          <section>
            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase mb-6 flex items-center gap-3 pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10" style={{ fontFamily: SERIF }}>
              <FileText className="w-6 h-6 text-[#3B4FD8] dark:text-[#6C7EF5]" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Company Name *</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Tagline</label>
                <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="input-field" placeholder="e.g. Innovating the future" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Industry *</label>
                <select name="industry" value={formData.industry} onChange={handleChange} required className="input-field">
                  <option value="">Select Industry</option>
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Company Size *</label>
                <select name="size" value={formData.size} onChange={handleChange} required className="input-field">
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Year Founded</label>
                <input type="number" name="founded" value={formData.founded} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="input-field" placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="input-field !resize-y" ></textarea>
              </div>
            </div>
          </section>

          {/* Location & Contact Section */}
          <section>
            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase mb-6 flex items-center gap-3 pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10" style={{ fontFamily: SERIF }}>
              <MapPin className="w-6 h-6 text-[#3B4FD8] dark:text-[#6C7EF5]" /> Location & Contact
            </h3>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Primary Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Headquarters</label>
                <input type="text" name="headquarters" value={formData.headquarters} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Contact Email *</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Contact Phone</label>
                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </section>

          {/* Social Links Section */}
          <section>
            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase mb-6 flex items-center gap-3 pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10" style={{ fontFamily: SERIF }}>
              <Globe className="w-6 h-6 text-[#3B4FD8] dark:text-[#6C7EF5]" /> Social Presence
            </h3>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>LinkedIn URL</label>
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7194] dark:text-[#8B90B8] w-4 h-4 pointer-events-none" />
                  <input type="url" value={formData.socialLinks.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} className="input-field !pl-12" placeholder="https://linkedin.com/company/..." />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Twitter URL</label>
                <div className="relative">
                  <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7194] dark:text-[#8B90B8] w-4 h-4 pointer-events-none" />
                  <input type="url" value={formData.socialLinks.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} className="input-field !pl-12" placeholder="https://twitter.com/..." />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Facebook URL</label>
                <div className="relative">
                  <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7194] dark:text-[#8B90B8] w-4 h-4 pointer-events-none" />
                  <input type="url" value={formData.socialLinks.facebook} onChange={(e) => handleSocialChange('facebook', e.target.value)} className="input-field !pl-12" placeholder="https://facebook.com/..." />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Instagram URL</label>
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7194] dark:text-[#8B90B8] w-4 h-4 pointer-events-none" />
                  <input type="url" value={formData.socialLinks.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)} className="input-field !pl-12" placeholder="https://instagram.com/..." />
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section>
            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase mb-6 flex items-center gap-3 pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10" style={{ fontFamily: SERIF }}>
              <CheckCircle className="w-6 h-6 text-[#3B4FD8] dark:text-[#6C7EF5]" /> Key Benefits
            </h3>
            <div className="space-y-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  className="input-field"
                  placeholder="e.g. Remote Work, Health Insurance"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-6 bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white dark:text-[#1A1D2E] rounded-none hover:bg-[#1A1D2E] dark:hover:bg-white transition-colors flex items-center justify-center font-bold uppercase text-[10px] tracking-widest"
                  style={{ fontFamily: MONO }}
                >
                  <Plus className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] rounded-none border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 group hover:border-[#E25C5C]/50 transition-colors cursor-default">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: MONO }}>{benefit}</span>
                    <button type="button" onClick={() => removeBenefit(index)} className="text-[#6B7194] dark:text-[#8B90B8] group-hover:text-[#E25C5C] transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.benefits.length === 0 && (
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7194]/50 dark:text-[#8B90B8]/50" style={{ fontFamily: MONO }}>No benefits added yet.</p>
                )}
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section>
            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase mb-6 flex items-center gap-3 pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10" style={{ fontFamily: SERIF }}>
              <Building2 className="w-6 h-6 text-[#3B4FD8] dark:text-[#6C7EF5]" /> Tech Stack
            </h3>
            <div className="space-y-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  className="input-field"
                  placeholder="e.g. React, Node.js, Python"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-6 bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white dark:text-[#1A1D2E] rounded-none hover:bg-[#1A1D2E] dark:hover:bg-white transition-colors flex items-center justify-center font-bold uppercase text-[10px] tracking-widest"
                  style={{ fontFamily: MONO }}
                >
                  <Plus className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {formData.techStack.map((tech, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] rounded-none border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 group hover:border-[#E25C5C]/50 transition-colors cursor-default">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: MONO }}>{tech}</span>
                    <button type="button" onClick={() => removeTech(index)} className="text-[#6B7194] dark:text-[#8B90B8] group-hover:text-[#E25C5C] transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.techStack.length === 0 && (
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7194]/50 dark:text-[#8B90B8]/50" style={{ fontFamily: MONO }}>No technologies added yet.</p>
                )}
              </div>
            </div>
          </section>

          {/* Hiring Manager Section */}
          <section>
            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase mb-6 flex items-center gap-3 pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10" style={{ fontFamily: SERIF }}>
              <Users className="w-6 h-6 text-[#3B4FD8] dark:text-[#6C7EF5]" /> Hiring Manager
            </h3>
            <div className="p-8 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 rounded-none space-y-6 md:space-y-8 shadow-[4px_4px_0_0_rgba(59,79,216,0.05)] dark:shadow-[4px_4px_0_0_rgba(108,126,245,0.05)]">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Name</label>
                <input type="text" value={formData.hiringManager.name} onChange={(e) => handleHiringManagerChange('name', e.target.value)} className="input-field" />
              </div>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Role</label>
                  <input type="text" value={formData.hiringManager.role} onChange={(e) => handleHiringManagerChange('role', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Email</label>
                  <input type="email" value={formData.hiringManager.email} onChange={(e) => handleHiringManagerChange('email', e.target.value)} className="input-field" />
                </div>
              </div>
            </div>
          </section>

          <div className="pt-10 flex justify-end border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 mt-12 mb-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-10 py-4 bg-[#F5A623] dark:bg-[#F9C74F] text-white dark:text-[#1A1D2E] font-bold text-[12px] uppercase tracking-[0.2em] rounded-none hover:bg-[#d9911a] hover:-translate-y-1 shadow-[4px_4px_0_0_rgba(26,29,46,0.15)] dark:shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_rgba(26,29,46,0.15)]"
              style={{ fontFamily: MONO }}
            >
              <Save className="w-5 h-5" strokeWidth={3} />
              {loading ? 'UPDATING PROFILE...' : 'UPDATE PROFILE'}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        .input-field {
           width: 100%;
           padding: 0.85rem 1.2rem;
           border-radius: 0;
           border: 1px solid rgba(59, 79, 216, 0.2);
           background-color: white;
           color: #1A1D2E;
           font-family: ${MONO};
           font-size: 11px;
           letter-spacing: 0.05em;
           transition: all 0.2s ease;
        }
        .input-field:focus {
           outline: none;
           border-color: #3B4FD8;
           background-color: #F7F8FF;
           box-shadow: 2px 2px 0 0 rgba(59, 79, 216, 0.1);
        }
        .dark .input-field {
           border-color: rgba(108, 126, 245, 0.2);
           background-color: #252A41;
           color: #E8EAF2;
        }
        .dark .input-field:focus {
           border-color: #6C7EF5;
           background-color: #1A1D2E;
           box-shadow: 2px 2px 0 0 rgba(108, 126, 245, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CompanyProfile;
