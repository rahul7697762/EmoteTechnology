// job-portal/pages/CompanyProfile.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Upload, Save, AlertCircle, Globe, Mail, Phone,
  MapPin, Facebook, Linkedin, Twitter, Instagram, Plus, Trash2, X,
  CheckCircle, FileText, Users
} from 'lucide-react';
import { companyAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../services/toast';

const CompanyProfile = () => {
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
          logoPreview: data.logoUrl || '',
          coverPreview: data.coverUrl || '',
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
        if (key === 'logo' && formData.logo) {
          submitData.append('logo', formData.logo);
        } else if (key === 'coverImage' && formData.coverImage) {
          submitData.append('coverImage', formData.coverImage);
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
      setSuccess(true);
      showToast.success('Profile updated successfully!');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
      showToast.error('Failed to update profile');
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
    <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">

      {/* Header with Cover Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
        {formData.coverPreview ? (
          <img src={formData.coverPreview} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Building2 className="w-16 h-16 opacity-20" />
            <span className="ml-2 opacity-50 font-medium">Add a cover image to showcase your brand</span>
          </div>
        )}
        <label className="absolute top-4 right-4 cursor-pointer bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2 text-sm font-medium">
          <Upload className="w-4 h-4" /> Change Cover
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} className="hidden" />
        </label>
      </div>

      <div className="px-8 pb-8">
        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-[#1a1c23] bg-white dark:bg-gray-800 shadow-lg overflow-hidden flex items-center justify-center">
              {formData.logoPreview ? (
                <img src={formData.logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-2 right-2 p-2 bg-teal-500 text-white rounded-full cursor-pointer shadow-lg hover:bg-teal-600 transition-transform hover:scale-105">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="hidden" />
            </label>
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {formData.companyName || 'Company Name'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {formData.industry || 'Industry'} • {formData.location || 'Location'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400 animate-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Basic Info Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <FileText className="w-5 h-5 text-teal-500" /> Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name *</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tagline</label>
                <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="input-field" placeholder="e.g. Innovating the future" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry *</label>
                <select name="industry" value={formData.industry} onChange={handleChange} required className="input-field">
                  <option value="">Select Industry</option>
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Size *</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year Founded</label>
                <input type="number" name="founded" value={formData.founded} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="input-field" placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="input-field" ></textarea>
              </div>
            </div>
          </section>

          {/* Location & Contact Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <MapPin className="w-5 h-5 text-teal-500" /> Location & Contact
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Headquarters</label>
                <input type="text" name="headquarters" value={formData.headquarters} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Email *</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Phone</label>
                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </section>

          {/* Social Links Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <Globe className="w-5 h-5 text-teal-500" /> Social Presence
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="url" value={formData.socialLinks.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} className="input-field pl-10" placeholder="LinkedIn URL" />
              </div>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="url" value={formData.socialLinks.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} className="input-field pl-10" placeholder="Twitter URL" />
              </div>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="url" value={formData.socialLinks.facebook} onChange={(e) => handleSocialChange('facebook', e.target.value)} className="input-field pl-10" placeholder="Facebook URL" />
              </div>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="url" value={formData.socialLinks.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)} className="input-field pl-10" placeholder="Instagram URL" />
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <CheckCircle className="w-5 h-5 text-teal-500" /> Key Benefits
            </h3>
            <div className="space-y-4">
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
                  className="p-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg border border-teal-100 dark:border-teal-900/50">
                    <span className="text-sm font-medium">{benefit}</span>
                    <button type="button" onClick={() => removeBenefit(index)} className="text-teal-500 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.benefits.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No benefits added yet.</p>
                )}
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <Building2 className="w-5 h-5 text-teal-500" /> Tech Stack
            </h3>
            <div className="space-y-4">
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
                  className="p-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.techStack.map((tech, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <span className="text-sm font-medium">{tech}</span>
                    <button type="button" onClick={() => removeTech(index)} className="text-blue-500 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.techStack.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No technologies added yet.</p>
                )}
              </div>
            </div>
          </section>

          {/* Hiring Manager Section */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <Users className="w-5 h-5 text-teal-500" /> Hiring Manager
            </h3>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input type="text" value={formData.hiringManager.name} onChange={(e) => handleHiringManagerChange('name', e.target.value)} className="input-field !bg-white dark:!bg-gray-800" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <input type="text" value={formData.hiringManager.role} onChange={(e) => handleHiringManagerChange('role', e.target.value)} className="input-field !bg-white dark:!bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input type="email" value={formData.hiringManager.email} onChange={(e) => handleHiringManagerChange('email', e.target.value)} className="input-field !bg-white dark:!bg-gray-800" />
                </div>
              </div>
            </div>
          </section>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        .input-field {
           width: 100%;
           padding: 0.75rem 1rem;
           border-radius: 0.75rem;
           border: 1px solid #e5e7eb;
           background-color: white;
           color: #111827;
           transition: all 0.2s;
        }
        .dark .input-field {
           border-color: #374151;
           background-color: #374151;
           color: white;
        }
        .dark .input-field:focus {
           border-color: #14b8a6;
           ring: 1px solid #14b8a6;
        }
      `}</style>
    </div>
  );
};

export default CompanyProfile;
