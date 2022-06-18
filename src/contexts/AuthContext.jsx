import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: (email, password) => Promise.resolve(),
  loading: true,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setloading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        const { data: user } = await api.get("user/me");
        if (user) setUser(user);
      }
      setloading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data: token } = await api.post("user/login", { email, password });
    if (token) {
      console.log(token);
      localStorage.setItem("token", token.accessToken);
      api.defaults.headers.Authorization = `Bearer ${token.accessToken}`;
      const { data: user } = await api.get("user/me");
      console.log(user);
      setUser(user);
    }
    return Promise.resolve(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.Authorization;
    // window.location.pathname = "/login";
    router.push("/login");
  };

  const values = {
    isAuthenticated: !!user,
    user,
    login,
    loading,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
