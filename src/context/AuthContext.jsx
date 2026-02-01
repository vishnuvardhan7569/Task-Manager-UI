import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { message } from "antd";

const AuthContext = createContext();
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    token: null,
    user: null,
    loading: true,
  });

  const { token, user, loading } = state;
  const navigate = useNavigate();
  const fetchUserRef = useRef(false);

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const elapsed = Date.now() - parseInt(loginTime);
        if (elapsed >= SESSION_TIMEOUT) {
          logout();
          message.warning("Session expired. Please login again.");
        }
      }
    };

    checkSession();

    const interval = setInterval(checkSession, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setState((prev) => ({ ...prev, token: savedToken }));
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setState((prev) => ({ ...prev, loading: false, user: null }));
      fetchUserRef.current = false;
      return;
    }

    if (fetchUserRef.current) return;
    fetchUserRef.current = true;

    api
      .get("/me")
      .then((res) => setState((prev) => ({ ...prev, user: res.data })))
      .catch(() => {
        localStorage.removeItem("token");
        setState({ token: null, user: null, loading: false });
        fetchUserRef.current = false;
      })
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("loginTime", Date.now());
    setState((prev) => ({ ...prev, token: jwtToken }));
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    setState({ token: null, user: null, loading: false });
    message.info("Logged out successfully");
    navigate("/login");
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/account");
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      setState({ token: null, user: null, loading: false });
      message.success("Your account has been deleted successfully");
      navigate("/login");
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to delete account");
    }
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("loginTime");
          setState({ token: null, user: null, loading: false });
          message.warning("Session expired. Please login again.");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        deleteAccount,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
