import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../utils/database';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isStudent: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('moodtalk_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in database
      const storedUser = db.getUserByEmail(email);
      
      if (!storedUser) {
        throw new Error('User not found');
      }
      
      // In production, verify password hash
      if (storedUser.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Convert stored user to User type
      const user: User = {
        ...storedUser,
        createdAt: new Date(storedUser.createdAt),
      };
      
      setUser(user);
      localStorage.setItem('moodtalk_user', JSON.stringify(user));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, isStudent: boolean) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user in database
      const storedUser = await db.createUser({
        email,
        name,
        password, // In production, hash this password
        plan: isStudent ? 'premium' : 'free',
        isStudent,
        wellnessLevel: 1,
        totalSessions: 0,
        journalEntries: 0,
        mindfulMinutes: 0,
        badges: []
      });
      
      // Convert stored user to User type
      const user: User = {
        ...storedUser,
        createdAt: new Date(storedUser.createdAt),
      };
      
      setUser(user);
      localStorage.setItem('moodtalk_user', JSON.stringify(user));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('moodtalk_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}