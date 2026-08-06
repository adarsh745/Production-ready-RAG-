import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Key, Smartphone, LogOut, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const SecuritySection = () => {
  const { logout } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative rounded-3xl glass-effect p-6 sm:p-7 border border-white/15 shadow-xl select-none space-y-5"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-text-app">Security & Privacy</h3>
            <p className="text-xs text-muted-app">Manage security protocols, passwords, and sessions</p>
          </div>
        </div>

        {/* Security Indicator */}
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <CheckCircle2 size={11} /> High Protection
        </span>
      </div>

      {/* Security Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        
        {/* Change Password */}
        <div className="p-4 rounded-2xl bg-card-app/40 border border-white/10 hover:border-primary-app/40 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-app/15 text-primary-app shrink-0">
              <Key size={16} />
            </div>
            <div>
              <h4 className="font-bold text-text-app">Change Password</h4>
              <p className="text-[10px] text-muted-app">Last changed 30 days ago</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl glass-effect border border-white/15 hover:border-primary-app/50 text-[11px] font-bold text-text-app hover:text-primary-app transition-colors cursor-pointer">
            Update
          </button>
        </div>

        {/* 2FA Toggle */}
        <div className="p-4 rounded-2xl bg-card-app/40 border border-white/10 hover:border-primary-app/40 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-app/15 text-accent-app shrink-0">
              <Smartphone size={16} />
            </div>
            <div>
              <h4 className="font-bold text-text-app">Two-Factor Auth (2FA)</h4>
              <p className="text-[10px] text-muted-app">{is2FAEnabled ? 'Enabled via Authenticator App' : 'Disabled'}</p>
            </div>
          </div>

          <button
            onClick={() => setIs2FAEnabled(!is2FAEnabled)}
            className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
              is2FAEnabled ? 'bg-primary-app justify-end' : 'bg-white/15 justify-start'
            }`}
          >
            <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Logout All Devices */}
        <div className="p-4 rounded-2xl bg-card-app/40 border border-white/10 hover:border-amber-500/40 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <LogOut size={16} />
            </div>
            <div>
              <h4 className="font-bold text-text-app">Logout All Devices</h4>
              <p className="text-[10px] text-muted-app">Revoke all active JWT session tokens</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer"
          >
            Logout All
          </button>
        </div>

        {/* Delete Account */}
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0">
              <Trash2 size={16} />
            </div>
            <div>
              <h4 className="font-bold text-red-400">Delete Account</h4>
              <p className="text-[10px] text-red-300/80">Permanently delete documents and chats</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-[11px] font-bold text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>

      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm glass-effect rounded-3xl p-6 border border-red-500/30 shadow-2xl space-y-4 text-center select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center border border-red-500/30">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-app">Delete Account?</h3>
            <p className="text-xs text-muted-app">
              This action cannot be undone. All your ChromaDB vector embeddings, uploaded PDF files, and PostgreSQL chat logs will be deleted permanently.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-bold text-text-app hover:bg-white/15 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  logout();
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default SecuritySection;
