'use client';

import * as React from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/firebase/auth';
import { db } from '@/firebase/firestore';

export type UserRole = 'doctor' | 'admin' | 'unknown';

export interface UserProfile {
  uid: string;
  role: UserRole;
  clinicId: string | null;
  name: string | null;
  email: string | null;
  isActive: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let unsubscribe = false;

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribe) return;

      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (unsubscribe) return;

          if (snap.exists()) {
            const data = snap.data();
            setProfile({
              uid: firebaseUser.uid,
              role: (data.role as UserRole) ?? 'unknown',
              clinicId: data.clinicId ?? null,
              name: data.name ?? null,
              email: data.email ?? firebaseUser.email ?? null,
              isActive: data.isActive ?? false,
            });
          } else {
            setProfile({
              uid: firebaseUser.uid,
              role: 'unknown',
              clinicId: null,
              name: null,
              email: firebaseUser.email ?? null,
              isActive: false,
            });
          }
        } catch (err) {
          console.error('Failed to load user profile:', err);
          setProfile(null);
        } finally {
          if (!unsubscribe) setLoading(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe = true;
      unsub();
    };
  }, []);

  const logout = React.useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: !!user,
      logout,
    }),
    [user, profile, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
