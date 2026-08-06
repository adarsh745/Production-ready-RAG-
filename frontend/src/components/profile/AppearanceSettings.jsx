import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

export const AppearanceSettings = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const themeOptions = [
    { id: 'dark', label: 'Dark Mode', icon: Moon },
    { id: 'light', label: 'Light Mode', icon: Sun },
    { id: 'system', label: 'System Theme', icon: Monitor },
  ];

  return (
    <div className="space-y-2 select-none">
      <h4 className="text-xs font-bold text-muted-app uppercase tracking-wider">
        Appearance & Interface Mode
      </h4>

      <div className="grid grid-cols-3 gap-2">
        {themeOptions.map((opt) => {
          const IconComponent = opt.icon;
          const isActive = theme === opt.id || (opt.id === 'system' && theme === 'dark');

          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTheme(opt.id === 'system' ? 'dark' : opt.id)}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                isActive
                  ? 'bg-primary-app/20 border-primary-app text-primary-app shadow-md'
                  : 'bg-card-app/40 border-white/10 text-muted-app hover:text-text-app hover:bg-white/5'
              }`}
            >
              <IconComponent size={16} />
              <span>{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AppearanceSettings;
