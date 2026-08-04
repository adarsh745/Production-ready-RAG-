/**
 * Combines CSS class names filtering out falsy values.
 * A lightweight replacement for clsx / tailwind-merge.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a similarity score into a percentage string (e.g. 0.9412 -> "94%")
 */
export function formatScore(score) {
  if (typeof score !== 'number') return '0%';
  return `${Math.round(score * 100)}%`;
}

/**
 * Formats a timestamp into a friendly hour:minute string
 */
export function formatTime(date = new Date()) {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Simulates a delay for async tasks
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
