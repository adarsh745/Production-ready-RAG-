import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { documentService } from '../services/documentService';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileCompletion from '../components/profile/ProfileCompletion';
import StatsCards from '../components/profile/StatsCards';
import Achievements from '../components/profile/Achievements';
import ProfileForm from '../components/profile/ProfileForm';
import ActivityTimeline from '../components/profile/ActivityTimeline';
import SecuritySection from '../components/profile/SecuritySection';
import AppearanceSettings from '../components/profile/AppearanceSettings';
import ThemeColorSelector from '../components/profile/ThemeColorSelector';
import QuickActions from '../components/profile/QuickActions';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveStats = async () => {
      try {
        const stats = await documentService.getProfileStats();
        if (isMounted) setLiveStats(stats);
      } catch (err) {
        console.error('Failed to fetch real-time profile stats:', err);
      }
    };
    fetchLiveStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto bg-bg-app text-text-app p-4 sm:p-6 lg:p-8 space-y-8 select-none relative font-sans">
      
      {/* Background Animated Ambient Lighting Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-app/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-app/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Top Header Row: Full-Width Profile Header with Cloudinary Avatar Upload */}
        <div className="w-full">
          <ProfileHeader user={user} />
        </div>

        {/* Row 2: Setup Progress & Quick Workflows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1">
            <ProfileCompletion percentage={92} />
          </div>
          <div className="lg:col-span-2">
            <div className="h-full rounded-3xl glass-effect p-6 border border-white/15 shadow-xl flex items-center">
              <QuickActions />
            </div>
          </div>
        </div>

        {/* Row 3: Real-Time Workspace Performance Metrics */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-app uppercase tracking-wider flex items-center justify-between">
            <span>Workspace Performance Metrics</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Realtime Database Stream
            </span>
          </h3>
          <StatsCards stats={liveStats || {}} />
        </div>

        {/* Row 4: Platform Achievements */}
        <Achievements />

        {/* Row 5: Account Information (Form) & Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <ProfileForm user={user} />
          </div>
          <div className="lg:col-span-1">
            <ActivityTimeline />
          </div>
        </div>

        {/* Row 6: Security Section & Theme Customizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2" id="security-section">
            <SecuritySection />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-3xl glass-effect p-6 border border-white/15 shadow-xl space-y-5">
              <AppearanceSettings />
              <div className="border-t border-white/10 pt-4">
                <ThemeColorSelector />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
