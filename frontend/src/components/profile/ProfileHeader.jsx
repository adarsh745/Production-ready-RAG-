import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Building2, Calendar, ShieldCheck, Sparkles, Mail, Camera, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

export const ProfileHeader = ({ user = {}, onAvatarUpdated }) => {
  const [avatarUrl, setAvatarUrl] = useState(
    user.avatar_url ||
    user.avatar ||
    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`
  );
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const name = user.full_name || user.name || 'Adarsh Gupta';
  const email = user.email || 'adarsh@ai-rag.io';
  const role = user.role || 'Senior AI Solutions Architect';
  const company = user.company || 'Enterprise RAG Systems';
  const country = user.country || 'United States';
  const joinedDate = user.created_at || 'January 2024';

  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setToastMessage('');

    try {
      const res = await authService.uploadAvatar(file);
      if (res.avatar_url) {
        setAvatarUrl(res.avatar_url);
        setToastMessage('Profile picture uploaded to Cloudinary!');
        if (onAvatarUpdated) onAvatarUpdated(res.avatar_url);
      }
    } catch (err) {
      console.error('Cloudinary Avatar Upload Error:', err);
      setToastMessage('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl glass-effect p-6 sm:p-8 border border-white/15 shadow-2xl overflow-hidden select-none"
    >
      {/* Background Radial Glow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-app/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden File Input */}
      <input
        type="file"
        id="avatar-upload-input"
        accept="image/*"
        onChange={handleAvatarFileSelect}
        className="hidden"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        
        {/* Floating Profile Avatar Vessel with Sleek Corner Camera Button */}
        <div className="relative group shrink-0">
          {/* Animated Glowing Outer Ring */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary-app via-accent-app to-secondary-app opacity-75 blur-md group-hover:opacity-100 transition-all duration-500 animate-pulse" />
          
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-[#121118] overflow-hidden border-2 border-primary-app/50 shadow-2xl">
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Sleek Camera Upload Badge Icon (Positioned cleanly on corner above image) */}
          <label
            htmlFor="avatar-upload-input"
            className="absolute top-0 left-0 p-2 rounded-full bg-[#121118] border border-primary-app/60 text-primary-app hover:text-white hover:bg-primary-app shadow-xl cursor-pointer transition-all duration-200 active:scale-95 z-20 group/cam"
            title="Upload profile picture to Cloudinary"
          >
            {isUploading ? (
              <Loader2 size={14} className="animate-spin text-primary-app" />
            ) : (
              <Camera size={14} className="group-hover/cam:scale-110 transition-transform" />
            )}
          </label>

          {/* Verified Badge */}
          <div className="absolute top-0 right-0 p-1.5 rounded-full bg-primary-app text-white shadow-lg border border-white/20 z-20">
            <ShieldCheck size={14} />
          </div>

          {/* Online Status Indicator Pulse */}
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-3 border-[#121118] flex items-center justify-center shadow-lg z-20">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
        </div>

        {/* User Info Details */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-app tracking-tight">
              {name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-app/20 border border-primary-app/40 text-primary-app text-xs font-bold shadow-sm">
              <CheckCircle2 size={12} />
              Verified Pro
            </span>
          </div>

          <p className="text-sm font-semibold text-primary-app flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles size={14} />
            <span>{role}</span>
          </p>

          {/* Metadata Badges List */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-muted-app pt-1">
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-primary-app" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 size={13} className="text-accent-app" />
              <span>{company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-secondary-app" />
              <span>{country}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-muted-app" />
              <span>Member since {joinedDate}</span>
            </div>
          </div>

          {/* Toast Notification Alert */}
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-md mt-2"
            >
              <CheckCircle2 size={13} />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default ProfileHeader;
