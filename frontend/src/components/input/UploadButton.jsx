import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import UploadPipeline from '../UploadPipeline';

export const UploadButton = () => {
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);

  return (
    <>
      <div className="relative flex items-center">
        <Tooltip content="Upload & index document pipeline" position="top">
          <button
            type="button"
            onClick={() => setIsPipelineOpen(true)}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.03] border border-white/10 text-muted-app hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all select-none active:scale-95 cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </Tooltip>
      </div>

      {/* Real-time AI Ingestion Pipeline Overlay */}
      <UploadPipeline
        isOpen={isPipelineOpen}
        onClose={() => setIsPipelineOpen(false)}
      />
    </>
  );
};

export default UploadButton;
