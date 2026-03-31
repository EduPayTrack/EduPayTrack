import { useState, useEffect, useCallback } from 'react';

/**
 * usePersistentState - A robust hook for form persistence.
 * Saves state to localStorage so users don't lose progress during network drops,
 * blackouts, or unexpected shutdowns.
 * 
 * @param key Unique key for localStorage
 * @param initialState Initial value if nothing is saved
 */
export function usePersistentState<T>(key: string, initialState: T) {
  // Initialize state from localStorage once during the first render
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved) as T;
      }
    } catch (err) {
      console.error(`Error loading state from localStorage for key "${key}":`, err);
    }
    return initialState;
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error(`Error saving state to localStorage for key "${key}":`, err);
    }
  }, [key, state]);

  // Utility to clear the draft (usually called after successful submission)
  const clearDraft = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(key);
  }, [key, initialState]);

  return [state, setState, clearDraft] as const;
}
