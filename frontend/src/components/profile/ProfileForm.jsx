import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, MapPin, Globe, Edit2, Check, X, Sparkles, Clock, FileText } from 'lucide-react';

export const ProfileForm = ({ user = {}, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.full_name || user.name || 'Adarsh Gupta',
    email: user.email || 'adarsh@ai-rag.io',
    phone: user.phone || '+1 (555) 382-9102',
    role: user.role || 'Senior AI Solutions Architect',
    company: user.company || 'Enterprise RAG Systems',
    country: user.country || 'United States',
    timezone: user.timezone || 'UTC-5 (Eastern Time)',
    bio: user.bio || 'Building enterprise high-concurrency hybrid vector retrieval and LLM context synthesis applications.',
    joinedDate: user.created_at || 'January 2024',
  });

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative rounded-3xl glass-effect p-6 sm:p-8 border border-white/15 shadow-2xl overflow-hidden select-none"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary-app/20 text-primary-app">
            <User size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-text-app">Account Information</h3>
            <p className="text-xs text-muted-app">Manage your profile details and preferences</p>
          </div>
        </div>

        {/* Action Toggle Buttons */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl glass-effect border border-white/15 hover:border-primary-app/50 hover:bg-primary-app/10 text-xs font-bold text-text-app hover:text-primary-app flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Edit2 size={13} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-muted-app hover:text-text-app transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X size={13} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-primary-app to-accent-app text-xs font-bold text-white shadow-lg flex items-center gap-1 transition-all cursor-pointer hover:opacity-95"
            >
              <Check size={13} />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Form Fields Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-bold text-muted-app mb-1.5 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-app" />
            <input
              type="text"
              disabled={!isEditing}
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input border border-white/10 text-xs font-semibold text-text-app outline-none disabled:opacity-80 focus:border-primary-app transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-bold text-muted-app mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-app" />
            <input
              type="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input border border-white/10 text-xs font-semibold text-text-app outline-none disabled:opacity-80 focus:border-primary-app transition-all"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[11px] font-bold text-muted-app mb-1.5 uppercase tracking-wider">
            Phone Number
          </label>
          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-app" />
            <input
              type="text"
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input border border-white/10 text-xs font-semibold text-text-app outline-none disabled:opacity-80 focus:border-primary-app transition-all"
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-[11px] font-bold text-muted-app mb-1.5 uppercase tracking-wider">
            Professional Role
          </label>
          <div className="relative">
            <Sparkles size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-app" />
            <input
              type="text"
              disabled={!isEditing}
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input border border-white/10 text-xs font-semibold text-text-app outline-none disabled:opacity-80 focus:border-primary-app transition-all"
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="block text-[11px] font-bold text-muted-app mb-1.5 uppercase tracking-wider">
            Company / Organization
          </label>
          <div className="relative">
            <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-app" />
            <input
              type="text"
              disabled={!isEditing}
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input border border-white/10 text-xs font-semibold text-text-app outline-none disabled:opacity-80 focus:border-primary-app transition-all"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-[11px] font-bold text-muted-app mb-1.5 uppercase tracking-wider">
            Country / Region
          </label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-app" />
            <input
              type="text"
              disabled={!isEditing}
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input border border-white/10 text-xs font-semibold text-text-app outline-none disabled:opacity-80 focus:border-primary-app transition-all"
            />
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-[11px] font-bold text-muted-app mb-1.5 uppercase tracking-wider">
            Timezone
          </label>
          <div className="relative">
            <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-app" />
            <input
              type="text"
              disabled={!isEditing}
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input border border-white/10 text-xs font-semibold text-text-app outline-none disabled:opacity-80 focus:border-primary-app transition-all"
            />
          </div>
        </div>

        {/* Joined Date */}
        <div>
          <label className="block text-[11px] font-bold text-muted-app mb-1.5 uppercase tracking-wider">
            Joined Date
          </label>
          <div className="relative">
            <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-app" />
            <input
              type="text"
              disabled
              value={formData.joinedDate}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input border border-white/10 text-xs font-semibold text-muted-app outline-none opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Bio Text Area */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-muted-app mb-1.5 uppercase tracking-wider">
            Professional Bio
          </label>
          <div className="relative">
            <textarea
              rows={2}
              disabled={!isEditing}
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full p-3 rounded-2xl glass-input border border-white/10 text-xs font-medium text-text-app outline-none disabled:opacity-80 focus:border-primary-app transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

      </form>
    </motion.div>
  );
};

export default ProfileForm;
