import React, { createContext, useState, useContext} from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check localStorage for an existing user role on load
    const storedUser = localStorage.getItem("userRole");
    return storedUser ? { loginId: storedUser } : null;
  });

  const login = (loginId) => {
    setUser({ loginId });
    localStorage.setItem("userRole", loginId); // Store role in localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userRole"); // Clear role from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};