"use client";

import { useState, createContext, useContext, ReactNode } from 'react';
import Link from 'next/link';
import styles from '../layout.module.css';

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  setDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface LayoutProps {
  children: ReactNode;
  currentPage: 'home' | 'dashboard' | 'integrations' | 'preferences';
}

export default function Layout({ children, currentPage }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={`${styles.container} ${darkMode ? styles.darkMode : styles.lightMode}`}>
        {/* Hero Section with Navigation */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.logoArea}>
              <div className={styles.logo}>💰</div>
              <span className={styles.brandName}>FinanceFlow</span>
            </div>

            <nav className={styles.navigation}>
              <Link 
                href="/prototypes/finance-dashboard/home"
                className={`${styles.navItem} ${currentPage === 'home' ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>🏠</span>
                Home
              </Link>
              <Link 
                href="/prototypes/finance-dashboard"
                className={`${styles.navItem} ${currentPage === 'dashboard' ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>📊</span>
                Dashboard
              </Link>
              <Link 
                href="/prototypes/finance-dashboard/integrations"
                className={`${styles.navItem} ${currentPage === 'integrations' ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>🔗</span>
                Integrations
              </Link>
              <Link 
                href="/prototypes/finance-dashboard/preferences"
                className={`${styles.navItem} ${currentPage === 'preferences' ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>⚙️</span>
                Preferences
              </Link>
            </nav>

            <button 
              className={styles.darkModeToggle}
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {children}
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>FinanceFlow</h3>
              <p className={styles.footerText}>
                Your intelligent financial companion. Track, analyze, and optimize your finances with ease.
              </p>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Product</h4>
              <Link href="/prototypes/finance-dashboard/home" className={styles.footerLink}>Home</Link>
              <Link href="/prototypes/finance-dashboard" className={styles.footerLink}>Dashboard</Link>
              <Link href="/prototypes/finance-dashboard/integrations" className={styles.footerLink}>Integrations</Link>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Resources</h4>
              <a href="#" className={styles.footerLink}>Documentation</a>
              <a href="#" className={styles.footerLink}>API Reference</a>
              <a href="#" className={styles.footerLink}>Support</a>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Company</h4>
              <a href="#" className={styles.footerLink}>About</a>
              <a href="#" className={styles.footerLink}>Blog</a>
              <a href="#" className={styles.footerLink}>Careers</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>© 2025 FinanceFlow. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}

