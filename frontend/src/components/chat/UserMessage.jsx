import React from 'react';
import Avatar from '../common/Avatar';
import { FileText } from 'lucide-react';
import { formatTime } from '../../utils/helpers';

export const UserMessage = ({ message }) => {
  const { content, timestamp, files } = message;

  return (
    <div className="flex items-start justify-end gap-3.5 max-w-3xl ml-auto w-full group select-none">
      
      {/* Message Text Bubble & Metadata */}
      <div className="flex flex-col items-end gap-1.5 max-w-[85%]">
        
        {/* Timestamp */}
        <span className="text-[10px] text-muted-app/60 px-1">
          {formatTime(timestamp)}
        </span>

        {/* Text Container */}
        <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-app shadow-md select-text selection:bg-primary-app/30 selection:text-white leading-relaxed">
          {content}

          {/* Attached Files List */}
          {files && files.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-3 pt-2.5 border-t border-white/5">
              {files.map(file => (
                <div 
                  key={file.id} 
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-text-app"
                >
                  <FileText size={12} className="text-secondary-app" />
                  <div className="flex flex-col truncate">
                    <span className="truncate max-w-[150px] font-semibold text-[10px]">{file.name}</span>
                    <span className="text-[8px] text-muted-app">{file.size}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* User Avatar */}
      <Avatar role="user" size="sm" className="mt-5" />

    </div>
  );
};

export default UserMessage;
