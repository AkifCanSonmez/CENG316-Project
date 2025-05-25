// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/client'; // 👈 client.js'teki axios örneği

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await axios.post('/login', { email, password });
    const data = res.data;
    const me = {
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.email.split('@')[0],
    };
    setUser(me);
    return data;
  };

  const register = async (email, password, role) => {
    const res = await axios.post('/register', { email, password, role });
    return res.data;
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
