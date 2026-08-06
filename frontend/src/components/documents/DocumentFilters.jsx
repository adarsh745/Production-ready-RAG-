import React from 'react';
import { ArrowUpDown, Filter, UploadCloud, Plus } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const DocumentFilters = ({
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  onUploadClick,
}) => {
  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'name', label: 'A - Z' },
  ];

  const statusOptions = [
    { id: 'all', label: 'All Statuses' },
    { id: 'indexed', label: 'Indexed' },
    { id: 'processing', label: 'Processing' },
    { id: 'failed', label: 'Failed' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 select-none">
      
      {/* Status Filter */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-effect border border-white/10">
        <Filter size={14} className="text-muted-app ml-2 shrink-0" />
        <div className="flex items-center gap-1">
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onStatusFilterChange(opt.id)}
              className={cn(
                'px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer',
                statusFilter === opt.id
                  ? 'bg-primary-app text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                  : 'text-muted-app hover:text-text-app hover:bg-white/5'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Select Dropdown */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-effect border border-white/10">
        <ArrowUpDown size={14} className="text-muted-app ml-2 shrink-0" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-transparent text-xs text-text-app outline-none font-medium px-2 py-1.5 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.id} value={opt.id} className="bg-card-app text-text-app">
              Sort: {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Document Primary Action Button */}
      <button
        onClick={onUploadClick}
        className="px-4 py-2.5 rounded-2xl font-semibold text-xs text-white bg-gradient-to-r from-primary-app via-accent-app to-secondary-app hover:opacity-95 shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer ml-auto"
      >
        <Plus size={16} />
        <span>Upload Document</span>
      </button>

    </div>
  );
};

export default DocumentFilters;
