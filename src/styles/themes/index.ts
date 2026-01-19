/**
 * Material Design 3 Theme System
 * Export all theme-related styles and utilities
 */

import './tokens.css';
import './palettes.css';
import themeModule from './theme.module.css';

export const theme = themeModule;

/**
 * Theme types
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Set the application theme
 * @param theme - The theme to apply ('light', 'dark', or 'auto')
 */
export function setTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === 'auto') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }

  // Store preference
  localStorage.setItem('theme', theme);
}

/**
 * Get the current theme
 * @returns The current theme setting
 */
export function getTheme(): Theme {
  const stored = localStorage.getItem('theme') as Theme | null;
  return stored || 'auto';
}

/**
 * Initialize theme on app load
 */
export function initTheme(): void {
  const theme = getTheme();
  setTheme(theme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
  const current = getTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

/**
 * Check if the system prefers dark mode
 */
export function prefersColorScheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Watch for system color scheme changes
 */
export function watchColorScheme(callback: (scheme: 'light' | 'dark') => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handler);

  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handler);
}
