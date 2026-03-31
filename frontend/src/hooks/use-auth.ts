import { useEffect, useState } from 'react';

import { TOKEN_STORAGE_KEY } from '../config/env';
import type { AuthResponse } from '../types/api';

/** 
 * --- HOW THE APP REMEMBERS YOUR LOGIN ---
 * This manages keeping you logged in even if you refresh or open new tabs.
 */

// [SECTION: STORAGE NAMES] - Names for the browser to remember you
const USER_STORAGE_KEY = 'edupaytrack.auth.user';

export function useAuthState() {
  // [SECTION: KEEPING LOGIN DATA] - Memory for your security token and profile
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [authUser, setAuthUser] = useState<AuthResponse['user'] | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? (JSON.parse(storedUser) as AuthResponse['user']) : null;
  });

  // [SECTION: SAVING TO BROWSER] - Automatically saves info so it stays after refresh
  useEffect(() => {
    if (!token) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      return;
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }, [token]);

  useEffect(() => {
    if (!authUser) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return;
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
  }, [authUser]);

  // [SECTION: MULTI-TAB SYNC] - This makes sure Tab 2 knows if you logged in on Tab 1
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_STORAGE_KEY) {
        setToken(e.newValue);
      }
      if (e.key === USER_STORAGE_KEY) {
        try {
          setAuthUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setAuthUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // [SECTION: LOGIN/SIGN OUT ACTIONS] - Simple functions to start or stop a session
  const saveSession = (session: AuthResponse) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user));
    setToken(session.token);
    setAuthUser(session.user);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setAuthUser(null);
  };

  return {
    token,
    authUser,
    saveSession,
    clearSession,
    setAuthUser,
  };
}
