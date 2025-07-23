// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (userObj) => {
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
