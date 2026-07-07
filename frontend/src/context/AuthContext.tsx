import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserSettings } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string, avatar?: string) => Promise<void>;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  notifications: {
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
  },
  language: 'en',
  apiKey: '',
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const login = async (email: string, name: string = 'Security Analyst') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: 'usr-87236',
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
      role: 'SecOps Lead',
    };
    setUser(mockUser);
  };

  const register = async (name: string, email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: User = {
      id: `usr-${Math.floor(10000 + Math.random() * 90000)}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
      role: 'Analyst',
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (name: string, email: string, avatar?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(prev => prev ? { ...prev, name, email, avatar: avatar || prev.avatar } : null);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // Sync accessibility and theme if they changed
      if (newSettings.theme) {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newSettings.theme);
      }
      if (newSettings.accessibility) {
        const root = window.document.documentElement;
        if (newSettings.accessibility.highContrast) {
          root.classList.add('high-contrast');
        } else {
          root.classList.remove('high-contrast');
        }
      }
      return updated;
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateProfile, settings, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
