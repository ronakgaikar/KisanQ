import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kisanq_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kisanq_token');
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setUser((prev) => ({ ...prev, ...res.data }));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (mobile_number, password) => {
    const res = await api.post('/auth/login', { mobile_number, password });
    const { access_token, role, user_id, name } = res.data;
    
    const userData = { user_id, role, name, mobile_number };
    localStorage.setItem('kisanq_token', access_token);
    localStorage.setItem('kisanq_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (farmerData) => {
    const res = await api.post('/auth/register', farmerData);
    const { access_token, role, user_id, name } = res.data;
    
    const userData = { user_id, role, name, mobile_number: farmerData.mobile_number };
    localStorage.setItem('kisanq_token', access_token);
    localStorage.setItem('kisanq_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('kisanq_token');
    localStorage.removeItem('kisanq_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
