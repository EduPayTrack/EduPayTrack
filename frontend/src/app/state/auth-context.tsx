import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { toast } from 'sonner';
import { apiFetch, setToken, clearToken, getToken } from '../lib/api';
import { listNotifications, markAllNotificationsRead } from '../lib/notifications-api';

import {
  adminNav,
  studentNav,
  type AppUser,
  type NotificationItem,
  type Role,
} from '../lib/mock-data';

/* ---------- Types ---------- */

type LoginValues = {
  email: string;
  password: string;
};

type RegisterValues = {
  studentCode: string;
  fullName: string;
  email: string;
  schoolLevel: string;
  program?: string;
  classLevel?: string;
  year?: string;
  password: string;
};

type AuthContextValue = {
  user: AppUser | null;
  isLoading: boolean;
  notifications: NotificationItem[];
  navItems: typeof studentNav | typeof adminNav;
  login: (values: LoginValues) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
  markAllRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  updateProfile: (payload: Partial<AppUser>) => void;
};

/* ---------- Helpers ---------- */

const AUTH_STORAGE_KEY = 'edu-pay-track-auth';

function mapApiUserToAppUser(apiUser: any): AppUser {
  return {
    id: apiUser.id,
    name:
      `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim() || 'User',
    email: apiUser.email,
    role: apiUser.role.toLowerCase() as Role,
    avatar:
      (apiUser.firstName?.[0] || 'U') + (apiUser.lastName?.[0] || ''),
    studentId: apiUser.student?.studentCode,
    program: apiUser.student?.program,
    year: apiUser.student?.academicYear,
  };
}

/* ---------- Context ---------- */

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as AppUser;
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(() => !!getToken());
  const [appNotifications, setAppNotifications] = useState<NotificationItem[]>([]);

  // Persist or clear user in localStorage
  useEffect(() => {
    if (!user) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const refreshNotifications = useCallback(async () => {
    if (!getToken()) return;
    try {
      const data = await listNotifications();
      // map backend schema to NotificationItem format
      setAppNotifications(
        data.map(n => ({
          id: n.id,
          title: n.title,
          description: n.message,
          type: (n.type || 'system').toLowerCase(),
          time: new Intl.DateTimeFormat('en-MW', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(n.createdAt)),
          read: n.read,
          group: 'Today',
        }))
      );
    } catch {
      // ignore
    }
  }, []);

  // On mount, validate token by calling /auth/me
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiFetch<{ user: any }>('/auth/me')
      .then((data) => {
        setUser(mapApiUserToAppUser(data.user));
        refreshNotifications();
      })
      .catch(() => {
        // Token invalid — clear everything
        clearToken();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [refreshNotifications]);

  // Real-time notifications polling
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      refreshNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, [user, refreshNotifications]);


  const login = useCallback(async ({ email, password }: LoginValues) => {
    const payload = await apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(payload.token);
    const mappedUser = mapApiUserToAppUser(payload.user);
    setUser(mappedUser);
    toast.success(`Welcome back, ${mappedUser.name}`);
    refreshNotifications();
  }, [refreshNotifications]);

  const register = useCallback(async (values: RegisterValues) => {
    const [firstName, ...lastNameParts] = values.fullName.split(' ');
    const payload = await apiFetch<any>('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        studentCode: values.studentCode,
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        schoolLevel: values.schoolLevel,
        program: values.program,
        classLevel: values.classLevel,
        academicYear: values.year,
      }),
    });
    setToken(payload.token);
    const mappedUser = mapApiUserToAppUser(payload.user);
    setUser(mappedUser);
    toast.success('Account created successfully!');
    refreshNotifications();
  }, [refreshNotifications]);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore — log out locally regardless
    }
    clearToken();
    setUser(null);
    toast.message('You have been signed out');
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setAppNotifications((current) =>
        current.map((item) => ({ ...item, read: true }))
      );
    } catch {
      toast.error('Failed to mark notifications read');
    }
  }, []);

  const updateProfile = useCallback((payload: Partial<AppUser>) => {
    setUser((current) =>
      current ? { ...current, ...payload } : current
    );
    toast.success('Profile updated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      notifications: appNotifications,
      navItems: user?.role === 'student' 
        ? studentNav 
        : user?.role === 'accounts'
          ? adminNav.filter(item => !['/admin/users', '/admin/audit-logs'].includes(item.href))
          : adminNav,
      login,
      register,
      logout,
      markAllRead,
      refreshNotifications,
      updateProfile,
    }),
    [user, isLoading, appNotifications, login, register, logout, markAllRead, refreshNotifications, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
