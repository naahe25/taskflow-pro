import { createContext, useEffect, useState } from "react";
import { loginSuccess, loginWithCredentials, registerUser } from "../services/authService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromQuery = urlParams.get("token");
        if (tokenFromQuery) {
          localStorage.setItem("token", tokenFromQuery);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return; }
        const response = await loginSuccess();
        setUser(response.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await loginWithCredentials(email, password);
    localStorage.setItem("token", response.token);
    setUser(response.user);
    return response.user;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    localStorage.setItem("token", response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;