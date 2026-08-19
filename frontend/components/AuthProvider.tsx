"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  name: string;
  email: string;
  role: "commuter";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "safeTransitUsers";
const CURRENT_USER_KEY = "safeTransitCurrentUser";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  function register(name: string, email: string, password: string) {
    const savedUsers = localStorage.getItem(USERS_KEY);
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const alreadyExists = users.some(
      (savedUser: { email: string }) => savedUser.email === email
    );

    if (alreadyExists) return false;

    const newUser = { name, email, password, role: "commuter" as const };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);

    return true;
  }

  function login(email: string, password: string) {
    const savedUsers = localStorage.getItem(USERS_KEY);
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const foundUser = users.find(
      (savedUser: { email: string; password: string }) =>
        savedUser.email === email && savedUser.password === password
    );

    if (!foundUser) return false;

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
    setUser(foundUser);

    return true;
  }

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}