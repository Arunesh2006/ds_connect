'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkUserRole, fetchMyProfile } from '@/lib/api';
import { Member } from '@/types/api';

interface AuthContextType {
  user: Member | null;
  role: 'student' | 'admin';
  isAdmin: boolean;
  isLoading: boolean;
  loginAs: (role: 'student' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'student',
  isAdmin: false,
  isLoading: true,
  loginAs: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);
  const [role, setRole] = useState<'student' | 'admin'>('admin'); // Default admin in dev for convenient testing
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const roleData = await checkUserRole();
        const profile = await fetchMyProfile();
        if (profile) setUser(profile);
        
        const savedRole = localStorage.getItem('ds_user_role') as 'student' | 'admin' | null;
        const activeRole = savedRole || (roleData.is_admin ? 'admin' : 'student');
        setRole(activeRole);
        setIsAdmin(activeRole === 'admin');
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const loginAs = (newRole: 'student' | 'admin') => {
    setRole(newRole);
    setIsAdmin(newRole === 'admin');
    localStorage.setItem('ds_user_role', newRole);
  };

  const logout = () => {
    setUser(null);
    setRole('student');
    setIsAdmin(false);
    localStorage.removeItem('ds_user_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, isLoading, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
