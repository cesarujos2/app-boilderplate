// Application constants following SOLID principles
export const STORAGE_KEYS = {
  THEME: 'theme',
} as const;

export const THEME_CONFIG = {
  DEFAULT: 'light',
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export const VALIDATION_PATTERNS = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
  RUC: /^(10|20)\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;