// job-portal/components/CompanyOnboarding.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Upload, Save, AlertCircle, CheckCircle,
  Globe, Users, MapPin, Phone, Mail, FileText, ArrowRight,
  X, Plus, Trash2, ExternalLink
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getCompanyProfile, createOrUpdateProfile } from '../../../redux/slices/companySlice';
import { useNavigate } from 'react-router-dom';
import { showToast } from "./Toast";

const CompanyOnboarding = ({ onComplete }) => {
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [newBenefit, setNewBenefit] = useState('');
  const [newTech, setNewTech] = useState('');

  const steps = [
    { number: 1, title: 'Basic Info', icon: Building2 },
    { number: 2, title: 'Details', icon: FileText },
    { number: 3, title: 'Team', icon: Users },
    { number: 4, title: 'Review', icon: CheckCircle },
  ];

  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const role = authUser?.role || '';
    const isEmployer = ['COMPANY', 'EMPLOYER', 'ADMIN'].includes(role.toUpperCase());
    if (!isEmployer) {
      // hide onboarding for non-employers
      return;
    }
    loadExistingProfile();
  }, [authUser]);

  const loadExistingProfile = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getCompanyProfile()).unwrap();
      const data = response.company || response;
      if (data) {
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
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Logo size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    setLogoUploading(true);
    try {
      // In a real app, you would upload to cloud storage
      // For now, we'll create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: reader.result,
        }));
        setLogoUploading(false);
        showToast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload logo');
      setLogoUploading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Cover image size must be less than 10MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setCoverUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          coverImage: file,
          coverPreview: reader.result,
        }));
        setCoverUploading(false);
        showToast.success('Cover image uploaded');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload cover image');
      setCoverUploading(false);
    }
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

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.companyName.trim()) {
          setError('Company name is required');
          return false;
        }
        if (!formData.industry) {
          setError('Industry is required');
          return false;
        }
        break;
      case 2:
        if (!formData.description.trim()) {
          setError('Company description is required');
          return false;
        }
        if (!formData.location.trim()) {
          setError('Location is required');
          return false;
        }
        break;
      case 3:
        if (!formData.contactEmail.trim() || !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          setError('Valid contact email is required');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setError('');
      setStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    setSaving(true);
    setError('');

    try {
      const submitData = new FormData();

      // Append all form data
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
        } else if (key !== 'logoPreview' && key !== 'coverPreview' && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await dispatch(createOrUpdateProfile(submitData)).unwrap();

      setSuccess('Profile saved successfully!');
      showToast.success('Company profile completed!');

      // Redirect after delay
      setTimeout(() => {
        onComplete?.();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
      showToast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Manufacturing', 'Media & Entertainment', 'Telecommunications',
    'Transportation', 'Real Estate', 'Hospitality', 'Energy',
    'Biotechnology', 'E-commerce', 'SaaS', 'Consulting', 'Other'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees',
    '201-500 employees', '501-1000 employees', '1001-5000 employees',
    '5000+ employees'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
            <div
              className="absolute top-0 left-0 h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="relative flex justify-between">
            {steps.map((stepItem) => {
              const Icon = stepItem.icon;
              const isActive = stepItem.number === step;
              const isCompleted = stepItem.number < step;

              return (
                <div key={stepItem.number} className="flex flex-col items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center mb-2
                    ${isActive ? 'bg-teal-500 text-white' :
                      isCompleted ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-400'}
                    transition-all duration-300
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`
                    text-xs font-medium
                    ${isActive ? 'text-teal-500 dark:text-teal-400' :
                      isCompleted ? 'text-teal-600 dark:text-teal-500' :
                        'text-gray-500 dark:text-gray-400'}
                  `}>
                    {stepItem.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700 dark:text-green-400">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Company Information
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tell us about your company
              </p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Logo *
              </label>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {formData.logoPreview ? (
                      <img
                        src={formData.logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {logoUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={logoUploading}
                    />
                    <div className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors shadow-lg">
                      <Upload className="w-5 h-5" />
                    </div>
                  </label>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload your company logo. This will be displayed on your job postings.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Recommended: 400x400px, square aspect ratio</li>
                    <li>• Formats: PNG, JPG, SVG</li>
                    <li>• Max file size: 5MB</li>
                    <li>• Transparent background recommended</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Innovating the future"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Size
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Size</option>
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year Founded
                </label>
                <input
                  type="number"
                  name="founded"
                  value={formData.founded}
                  onChange={handleChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Company Details
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tell candidates more about your company
              </p>
            </div>

            {/* Cover Image */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image (Optional)
              </label>
              <div className="relative">
                <div className="h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {formData.coverPreview ? (
                    <img
                      src={formData.coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  {coverUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-4 right-4 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={coverUploading}
                  />
                  <div className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-lg flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {formData.coverPreview ? 'Change Cover' : 'Upload Cover'}
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Describe your company's mission, culture, values, and what makes it a great place to work..."
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {formData.description.length} characters
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Headquarters Location *
                </label>
                <input
                  type="text"
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="City, State, Country"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Social Media Links
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Team & Contact */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Contact Information
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                How candidates can reach you
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="careers@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Hiring Manager */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Hiring Manager (Optional)
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add contact details for the hiring manager
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.hiringManager.name}
                    onChange={(e) => handleHiringManagerChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.hiringManager.role}
                    onChange={(e) => handleHiringManagerChange('role', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="HR Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.hiringManager.email}
                    onChange={(e) => handleHiringManagerChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.hiringManager.phone}
                    onChange={(e) => handleHiringManagerChange('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Benefits
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.benefits.length}/10
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Add a benefit (e.g., Health insurance, Remote work)"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  disabled={!newBenefit.trim() || formData.benefits.length >= 10}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg"
                    >
                      <span>{benefit}</span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="hover:text-teal-900 dark:hover:text-teal-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tech Stack */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Technology Stack
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.techStack.length}/15
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Add a technology (e.g., React, Node.js, AWS)"
                />
                <button
                  type="button"
                  onClick={addTech}
                  disabled={!newTech.trim() || formData.techStack.length >= 15}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTech(index)}
                        className="hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Review & Submit
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Review your company profile before submitting
              </p>
            </div>

            <div className="space-y-6">
              {/* Company Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  {formData.logoPreview && (
                    <img
                      src={formData.logoPreview}
                      alt="Company logo"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {formData.companyName}
                    </h4>
                    {formData.tagline && (
                      <p className="text-gray-600 dark:text-gray-400">{formData.tagline}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Industry:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.industry}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Size:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.size}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Website:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.website || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Preview */}
              {formData.description && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Description
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {formData.description}
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Contact Information
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {formData.contactEmail}
                    </span>
                  </div>
                  {formData.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {formData.contactPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Benefits Preview */}
              {formData.benefits.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Company Benefits ({formData.benefits.length})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {formData.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg text-sm"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Preview */}
              {formData.techStack.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Technology Stack ({formData.techStack.length})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {formData.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submission Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    Once submitted, your company profile will be reviewed and activated.
                    You'll be able to post jobs immediately after approval.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex gap-4">
            {step < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyOnboarding;