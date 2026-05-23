import { createContext, useEffect, useState } from "react";
import { loginSuccess } from "../services/authService";

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

        const response = await loginSuccess();
        setUser(response.user);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
