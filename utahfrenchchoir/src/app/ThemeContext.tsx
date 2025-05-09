
// "use client";

// import React, { createContext, useContext, useState, useEffect } from 'react';

// type ThemeContextType = {
//   darkMode: boolean;
//   setDarkMode: (dark: boolean) => void;
// };

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [darkMode, setDarkMode] = useState(false);

//   // Load theme preference from localStorage on mount
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//       setDarkMode(savedTheme === 'dark');
//     }
//   }, []);

//   // Save theme preference to localStorage when it changes
//   useEffect(() => {
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   return (
//     <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// }

