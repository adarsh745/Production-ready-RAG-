import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2, Bot } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#09090B] flex flex-col items-center justify-center relative overflow-hidden select-none">
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[#7C3AED]/20 blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] p-[1px] shadow-[0_0_25px_rgba(124,58,237,0.4)] flex items-center justify-center">
            <div className="h-full w-full bg-[#09090B] rounded-[15px] flex items-center justify-center">
              <Bot className="h-6 w-6 text-[#7C3AED] animate-bounce" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-300 uppercase">
            <Loader2 className="w-4 h-4 text-[#7C3AED] animate-spin" />
            <span>Verifying Auth Session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
