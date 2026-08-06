import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

export const ThemeColorSelector = () => {
  const { accentColor, setAccentColor, ACCENT_COLORS } = useContext(ThemeContext);

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-primary-app/20 text-primary-app">
          <Palette size={14} />
        </div>
        <h4 className="text-xs font-bold text-text-app uppercase tracking-wider">
          Accent Color Selector
        </h4>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {Object.entries(ACCENT_COLORS).map(([key, item]) => {
          const isSelected = accentColor === key;
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAccentColor(key)}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-primary-app/25 border-primary-app text-text-app shadow-lg'
                  : 'bg-card-app/40 border-white/10 text-muted-app hover:text-text-app hover:bg-white/5'
              }`}
            >
              {/* Color Swatch Dot */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md transition-transform"
                style={{ backgroundColor: item.primary }}
              >
                {isSelected && <Check size={12} />}
              </div>

              <span className="text-[11px]">{item.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeColorSelector;
