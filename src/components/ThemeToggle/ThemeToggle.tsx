import { useState, useEffect } from 'react';

import styles from './ThemeToggle.module.css';

import { getTheme, setTheme, type Theme } from '@/styles';


export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('auto');

  useEffect(() => {
    setCurrentTheme(getTheme());
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${currentTheme === 'light' ? styles.active : ''}`}
        onClick={() => handleThemeChange('light')}
        aria-label="Tema claro"
      >
        ☀️ Claro
      </button>
      <button
        className={`${styles.button} ${currentTheme === 'auto' ? styles.active : ''}`}
        onClick={() => handleThemeChange('auto')}
        aria-label="Tema automático"
      >
        🌓 Auto
      </button>
      <button
        className={`${styles.button} ${currentTheme === 'dark' ? styles.active : ''}`}
        onClick={() => handleThemeChange('dark')}
        aria-label="Tema escuro"
      >
        🌙 Escuro
      </button>
    </div>
  );
}
