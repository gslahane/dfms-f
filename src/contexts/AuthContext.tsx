import React, { createContext, useContext, useState, useEffect } from "react";
import axios, { InternalAxiosRequestConfig } from "axios";

/** Roles aligned with backend enum */
type Role =
  | "STATE_ADMIN" | "STATE_CHECKER" | "STATE_MAKER"
  | "DISTRICT_ADMIN" | "DISTRICT_COLLECTOR" | "DISTRICT_DPO" | "DISTRICT_ADPO" | "DISTRICT_CHECKER" | "DISTRICT_MAKER"
  | "IA_ADMIN"
  | "MLA" | "MLA_REP"
  | "MLC"
  | "HADP_ADMIN"
  | "VENDOR";

type User = {
  token: string;
  username?: string;
  mobile?: string;
  agencyCode?: string;
  role?: Role;
  designation?: string;
  fullName?: string;
  districtId?: number;
  districtName?: string;
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

  /** Restore user from localStorage */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      const parsed = JSON.parse(userData);
      setUser({ ...parsed, token });
    }
    setIsLoading(false);
  }, []);

  /** Setup axios interceptor to inject token */
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token) {
          // ✅ FIX: Use set() if AxiosHeaders OR index if plain object
          if (config.headers && "set" in config.headers) {
            (config.headers as any).set("Authorization", `Bearer ${token}`);
          } else {
            (config.headers as any)["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  /** Login method */
  const login = (data: User) => {
    setUser(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  };

  /** Logout method */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
