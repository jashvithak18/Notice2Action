import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMeUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('n2a_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('n2a_token');
      if (storedToken) {
        try {
          const userData = await getMeUser();
          setUser(userData);
          setToken(storedToken);
        } catch {
          // Token invalid or expired
          localStorage.removeItem('n2a_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }
    restoreSession();
  }, []);

  const login = async (loginInput, password) => {
    const res = await loginUser(loginInput, password);
    localStorage.setItem('n2a_token', res.token);
    setToken(res.token);
    setUser({ _id: res._id, username: res.username, email: res.email });
    return res;
  };

  const register = async (username, email, password) => {
    const res = await registerUser(username, email, password);
    localStorage.setItem('n2a_token', res.token);
    setToken(res.token);
    setUser({ _id: res._id, username: res.username, email: res.email });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('n2a_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
