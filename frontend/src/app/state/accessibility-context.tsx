import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type PropsWithChildren,
} from 'react';

/* ---------- Types ---------- */

type AccessibilitySettings = {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
};

type AccessibilityContextValue = AccessibilitySettings & {
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setLargeText: (value: boolean) => void;
  resetSettings: () => void;
};

/* ---------- Constants ---------- */

const ACCESSIBILITY_STORAGE_KEY = 'edu-pay-track-accessibility';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
};

/* ---------- Helpers ---------- */

function getInitialSettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  // Check for system reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const saved = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
  if (!saved) {
    return {
      ...DEFAULT_SETTINGS,
      reducedMotion: prefersReducedMotion,
    };
  }
  
  try {
    const parsed = JSON.parse(saved) as Partial<AccessibilitySettings>;
    return {
      reducedMotion: parsed.reducedMotion ?? prefersReducedMotion,
      highContrast: parsed.highContrast ?? false,
      largeText: parsed.largeText ?? false,
    };
  } catch {
    return {
      ...DEFAULT_SETTINGS,
      reducedMotion: prefersReducedMotion,
    };
  }
}

function applyAccessibilityClasses(settings: AccessibilitySettings) {
  if (typeof document === 'undefined') return;
  
  const html = document.documentElement;
  
  // Reduced motion
  if (settings.reducedMotion) {
    html.classList.add('reduce-motion');
  } else {
    html.classList.remove('reduce-motion');
  }
  
  // High contrast
  if (settings.highContrast) {
    html.classList.add('high-contrast');
  } else {
    html.classList.remove('high-contrast');
  }
  
  // Large text
  if (settings.largeText) {
    html.classList.add('large-text');
  } else {
    html.classList.remove('large-text');
  }
}

/* ---------- Context ---------- */

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AccessibilitySettings>(getInitialSettings);

  // Apply classes whenever settings change
  useEffect(() => {
    applyAccessibilityClasses(settings);
  }, [settings]);

  // Listen for system reduced motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't explicitly set this (check localStorage)
      const saved = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
      if (!saved) {
        setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Persist settings
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setReducedMotion = useCallback((value: boolean) => {
    setSettings(prev => ({ ...prev, reducedMotion: value }));
  }, []);

  const setHighContrast = useCallback((value: boolean) => {
    setSettings(prev => ({ ...prev, highContrast: value }));
  }, []);

  const setLargeText = useCallback((value: boolean) => {
    setSettings(prev => ({ ...prev, largeText: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      ...settings,
      setReducedMotion,
      setHighContrast,
      setLargeText,
      resetSettings,
    }),
    [settings, setReducedMotion, setHighContrast, setLargeText, resetSettings]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used inside AccessibilityProvider');
  }
  return context;
}
