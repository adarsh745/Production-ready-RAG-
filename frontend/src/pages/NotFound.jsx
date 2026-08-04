import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlowButton from '../components/ui/GlowButton';
import LoadingOrb from '../components/ui/LoadingOrb';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6 bg-bg-app h-full min-h-[60vh] select-none">
      <LoadingOrb size="md" pulsing={false} />
      
      <div className="space-y-2 max-w-sm">
        <h2 className="text-3xl font-extrabold text-text-app dark:text-white tracking-wider">404</h2>
        <h3 className="text-sm font-semibold text-text-app">Workspace Node Missing</h3>
        <p className="text-[10px] text-muted-app leading-normal">
          The namespace directory path you are searching for does not exist in our vector networks.
        </p>
      </div>

      <GlowButton onClick={() => navigate('/')} variant="ghost" size="sm" className="text-xs font-semibold px-4 py-2 mt-2">
        Return to Workspace
      </GlowButton>
    </div>
  );
};

export default NotFound;
