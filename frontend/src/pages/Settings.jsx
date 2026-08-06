import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import GradientText from '../components/ui/GradientText';
import FileUpload from '../components/FileUpload';
import { useChat } from '../hooks/useChat';
import { 
  Shield, Sparkles, HardDrive, Sliders, CheckCircle2, 
  ArrowLeft, Cpu, Volume2, HelpCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const { selectedWorkspace } = useChat();
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6 select-none overflow-y-auto text-left">
      
      {/* Title Header with Back chevron */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-card-app border border-border-app text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:bg-white/[0.06] transition-all active:scale-95 cursor-pointer"
          title="Back to home"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-text-app dark:text-white tracking-wide">System Settings</h2>
          <p className="text-[10px] text-muted-app">Configure workspace parameters and LLM settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Category Menu */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1: LLM Engine Preferences */}
          <GlassCard className="space-y-4 p-5">
            <div className="flex items-center gap-2 pb-3.5 border-b border-border-app">
              <Cpu size={16} className="text-primary-app animate-pulse-slow" />
              <span className="text-xs font-bold text-text-app uppercase tracking-wider">Engine Preferences</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-app dark:text-white">System Context Parsing</h4>
                  <p className="text-[10px] text-muted-app leading-normal mt-0.5">
                    Inject active workspace folder document indexes into prompt vectors automatically.
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="rounded bg-bg-app border-border-app text-primary-app focus:ring-primary-app/20 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-app dark:text-white">Advanced Similarity Threshold</h4>
                  <p className="text-[10px] text-muted-app leading-normal mt-0.5">
                    Filter retrieved references below 70% relevance index values to save input budget.
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  className="rounded bg-bg-app border-border-app text-primary-app focus:ring-primary-app/20 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* Section 2: Storage & Index Summary */}
          <GlassCard className="space-y-4 p-5">
            <div className="flex items-center gap-2 pb-3.5 border-b border-border-app">
              <HardDrive size={16} className="text-secondary-app" />
              <span className="text-xs font-bold text-text-app uppercase tracking-wider">Workspace Database</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-bg-app border border-border-app shadow-sm">
                <span className="text-xs font-bold text-text-app dark:text-white">4 Files</span>
                <p className="text-[8px] text-muted-app uppercase tracking-wider mt-1">Indexed</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-app border border-border-app shadow-sm">
                <span className="text-xs font-bold text-text-app dark:text-white">4.1 MB</span>
                <p className="text-[8px] text-muted-app uppercase tracking-wider mt-1">Total Size</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-app border border-border-app shadow-sm">
                <span className="text-xs font-bold text-text-app dark:text-white">Pinecone</span>
                <p className="text-[8px] text-muted-app uppercase tracking-wider mt-1">Vector DB</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-app border border-border-app shadow-sm">
                <span className="text-xs font-bold text-[#27C93F]">Optimal</span>
                <p className="text-[8px] text-muted-app uppercase tracking-wider mt-1">Status</p>
              </div>
            </div>
          </GlassCard>

          {/* Section 3: 3D File Upload Component */}
          <GlassCard className="space-y-4 p-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border-app">
              <Sparkles size={16} className="text-primary-app animate-pulse" />
              <span className="text-xs font-bold text-text-app uppercase tracking-wider">Upload Documents to Vector Space</span>
            </div>
            <FileUpload />
          </GlassCard>

        </div>

        {/* Right Side: Premium upgrades package specs */}
        <div className="space-y-6">
          <GlassCard className="relative overflow-hidden p-5 border border-border-app bg-card-app dark:bg-gradient-to-b dark:from-[#1E112A] dark:via-[#111114] dark:to-[#111114] shadow-custom-shadow">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary-app via-accent-app to-secondary-app" />
            
            {/* sparkles tag */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-app dark:text-white uppercase tracking-wider mb-4">
              <Sparkles size={14} className="text-accent-app" />
              <span>Premium Pack</span>
            </div>

            <div className="space-y-3.5 mb-6 text-xs text-text-app/90">
              <div className="flex gap-2 items-start">
                <CheckCircle2 size={13} className="text-accent-app shrink-0 mt-0.5" />
                <span>Unlimited uploads (PDFs, DOCX)</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle2 size={13} className="text-accent-app shrink-0 mt-0.5" />
                <span>Smarter reasoning models</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle2 size={13} className="text-accent-app shrink-0 mt-0.5" />
                <span>1000+ workspace indices</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle2 size={13} className="text-accent-app shrink-0 mt-0.5" />
                <span>Synchronous Vision Grids</span>
              </div>
            </div>

            {/* Price block */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text-app dark:text-white">$15</span>
                <span className="text-[10px] text-muted-app uppercase tracking-wide">/ Month</span>
              </div>
              <p className="text-[9px] text-muted-app mt-0.5">Cancel subscription at any time.</p>
            </div>

            <GlowButton variant="gradient" size="md" className="w-full text-xs font-semibold py-3 shadow-[0_0_20px_rgba(124,58,237,0.25)]">
              Upgrade Now
            </GlowButton>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default Settings;
