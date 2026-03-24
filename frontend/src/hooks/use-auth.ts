import { useEffect, useState } from 'react';

import { TOKEN_STORAGE_KEY } from '../config/env';
import type { AuthResponse } from '../types/api';

const USER_STORAGE_KEY = 'edupaytrack.auth.user';

export function useAuthState() {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [authUser, setAuthUser] = useState<AuthResponse['user'] | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? (JSON.parse(storedUser) as AuthResponse['user']) : null;
  });

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
