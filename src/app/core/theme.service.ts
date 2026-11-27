import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type TrdTheme = 'light' | 'dark';

const STORAGE_KEY = 'trd-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  readonly theme = signal<TrdTheme>(this.readInitialTheme());
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.applyDomTheme(this.theme(), false);
  }

  toggleTheme(): void {
    const next: TrdTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(next: TrdTheme): void {
    this.theme.set(next);
    this.applyDomTheme(next, true);
  }

  private readInitialTheme(): TrdTheme {
    try {
      const attr = this.doc.documentElement.getAttribute('data-theme');
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      if (attr === 'dark' || attr === 'light') {
        return attr;
      }
    } catch {
      // Ignore storage access errors in restricted contexts
    }
    return 'dark';
  }

  private applyDomTheme(theme: TrdTheme, persist: boolean): void {
    const root = this.doc.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;

    const metaTheme = this.doc.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0b0f19' : '#F8FAFC');
    }

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Ignore storage write errors
      }
    }
  }
}
