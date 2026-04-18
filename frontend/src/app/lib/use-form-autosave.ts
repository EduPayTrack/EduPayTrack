import { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface AutosaveOptions<T> {
  key: string;
  data: T;
  onRestore?: (data: T) => void;
  debounceMs?: number;
  enabled?: boolean;
}

interface AutosaveState {
  lastSaved: Date | null;
  isRestored: boolean;
  hasDraft: boolean;
}

export function useFormAutosave<T extends Record<string, any>>({
  key,
  data,
  onRestore,
  debounceMs = 1000,
  enabled = true,
}: AutosaveOptions<T>) {
  const [state, setState] = useState<AutosaveState>({
    lastSaved: null,
    isRestored: false,
    hasDraft: false,
  });
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedDataRef = useRef<string | null>(null);

  // Check for existing draft on mount
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data && onRestore) {
          setState(prev => ({ ...prev, hasDraft: true }));
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [key, enabled, onRestore]);

  // Save data with debounce
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Skip if data is empty
    const hasData = Object.values(data).some(v => 
      v !== '' && v !== null && v !== undefined && v !== false
    );
    
    if (!hasData) return;

    // Debounced save
    timeoutRef.current = setTimeout(() => {
      const dataToSave = {
        data,
        timestamp: new Date().toISOString(),
      };
      
      const serialized = JSON.stringify(dataToSave);
      
      // Only save if data changed
      if (serialized !== savedDataRef.current) {
        localStorage.setItem(key, serialized);
        savedDataRef.current = serialized;
        setState(prev => ({
          ...prev,
          lastSaved: new Date(),
          hasDraft: true,
        }));
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, debounceMs, enabled]);

  // Restore draft
  const restoreDraft = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data && onRestore) {
          onRestore(parsed.data);
          setState(prev => ({ ...prev, isRestored: true }));
          return parsed.data;
        }
      }
    } catch (err) {
      console.error('Failed to restore draft:', err);
    }
    return null;
  }, [key, onRestore]);

  // Clear draft
  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(key);
    savedDataRef.current = null;
    setState({
      lastSaved: null,
      isRestored: false,
      hasDraft: false,
    });
  }, [key]);

  // Discard draft with confirmation
  const discardDraft = useCallback(() => {
    clearDraft();
    toast.info('Draft discarded');
  }, [clearDraft]);

  return {
    ...state,
    restoreDraft,
    clearDraft,
    discardDraft,
  };
}

export default useFormAutosave;
