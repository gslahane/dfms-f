import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

type User = {
  token: string;
  username?: string;
  mobile?: number;
  agencyCode?: string;
  role?: string;
  designation?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      const parsed = JSON.parse(userData);
      setUser({ ...parsed, token });
    }
    setIsLoading(false);
  }, []);

  // Setup axios interceptor to inject token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const login = (data: User) => {
    setUser(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Optionally redirect to /login here if you wish
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
