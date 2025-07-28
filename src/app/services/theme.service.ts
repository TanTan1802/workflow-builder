import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    // Check if we're in browser environment
    if (typeof localStorage !== 'undefined') {
      // Check if user has a theme preference in localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.enableDarkMode();
      } else if (savedTheme === 'light') {
        this.enableLightMode();
      } else {
        // Check system preference
        if (typeof window !== 'undefined' && window.matchMedia) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            this.enableDarkMode();
          }
        }
      }
    }
  }

  toggleTheme(): void {
    if (this.isDarkMode()) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode(): void {
    this.isDarkMode.set(true);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', 'dark');
    }
  }

  private enableLightMode(): void {
    this.isDarkMode.set(false);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', 'light');
    }
  }
}
