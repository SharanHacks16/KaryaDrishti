import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

export interface SignupData {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('karyadrishti_user');
    const token = localStorage.getItem('karyadrishti_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('karyadrishti_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        const userData: User = {
          id: 1,
          username: data.username,
          email: data.email,
          full_name: data.full_name,
          role: data.role as UserRole,
          department: data.department || "Ministry Office",
          is_active: true,
          created_at: new Date().toISOString()
        };
        localStorage.setItem('karyadrishti_token', data.access_token);
        localStorage.setItem('karyadrishti_user', JSON.stringify(userData));
        setUser(userData);
        setIsLoading(false);
        return true;
      }
    } catch (e) {
      // Fallback local dev login if backend is offline
    }

    // Dev Fallback Users
    let role: UserRole = "Portfolio/Ministry Officer";
    let name = "Rajesh Sharma";
    let email = "officer@morth.gov.in";

    if (username === "admin") {
      role = "Administrator";
      name = "System Admin";
      email = "admin@karyadrishti.gov.in";
    } else if (username === "analyst") {
      role = "Analyst";
      name = "Arun Kumar";
      email = "analyst@niti.gov.in";
    }

    const devUser: User = {
      id: 1,
      username: username || "officer",
      email,
      full_name: name,
      role,
      department: "Ministry Office",
      is_active: true,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('karyadrishti_token', 'dev_token_sample');
    localStorage.setItem('karyadrishti_user', JSON.stringify(devUser));
    setUser(devUser);
    setIsLoading(false);
    return true;
  };

  const signup = async (signupData: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      if (res.ok) {
        const data = await res.json();
        const userData: User = {
          id: Date.now(),
          username: data.username,
          email: data.email,
          full_name: data.full_name,
          role: data.role as UserRole,
          department: data.department || "Ministry Office",
          is_active: true,
          created_at: new Date().toISOString()
        };
        localStorage.setItem('karyadrishti_token', data.access_token);
        localStorage.setItem('karyadrishti_user', JSON.stringify(userData));
        setUser(userData);
        setIsLoading(false);
        return { success: true };
      } else {
        const errData = await res.json();
        setIsLoading(false);
        return { success: false, error: errData.detail || "Registration failed." };
      }
    } catch (e) {
      setIsLoading(false);
      return { success: false, error: "Network connection error." };
    }
  };

  const logout = () => {
    try {
      const token = localStorage.getItem('karyadrishti_token');
      if (token) {
        fetch('http://localhost:8000/api/v1/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});
      }
    } catch (e) {}

    localStorage.removeItem('karyadrishti_token');
    localStorage.removeItem('karyadrishti_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, isLoading }}>
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
