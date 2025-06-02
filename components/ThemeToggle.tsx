import React, { useState, useEffect } from 'react';

export const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      // localStorage.theme가 'light'가 아니면 다크 모드로 설정 (즉, 'dark'이거나, 설정되지 않았거나, 다른 값일 경우)
      return localStorage.theme !== 'light';
    }
    return false; // SSR 또는 비 브라우저 환경의 경우 기본값 (여기서는 크게 중요하지 않음)
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
      aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {isDarkMode ? (
        <i className="fas fa-sun text-yellow-400"></i>
      ) : (
        <i className="fas fa-moon text-secondary-500"></i>
      )}
    </button>
  );
};