import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  useEffect(() => {
    let active = true;

    api.get("/auth/me")
      .then((response) => {
        if (active) {
          setUser(response.data.success ? response.data.user : null);
        }
      })
      .catch((error) => {
        if (!active) return;

        if (error.response?.status !== 401) {
          console.error("Unable to restore the login session:", error);
        }
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};