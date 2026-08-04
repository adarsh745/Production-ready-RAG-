import React, { useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { Plus, Paperclip } from 'lucide-react';
import Tooltip from '../common/Tooltip';

export const UploadButton = () => {
  const { uploadFile } = useChat();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        uploadFile(files[i]);
      }
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative flex items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      <Tooltip content="Attach files or documentation" position="top">
        <button
          type="button"
          onClick={triggerUpload}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.03] border border-white/10 text-muted-app hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all select-none active:scale-95"
        >
          <Plus size={14} />
        </button>
      </Tooltip>
    </div>
  );
};

export default UploadButton;
