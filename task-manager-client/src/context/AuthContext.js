// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { message } from 'antd';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    setToken(token);
    setIsAuthenticated(!!token);
    messageApi.success('Успешный вход');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setIsAuthenticated(false);
    messageApi.info('Вы вышли из системы');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {contextHolder}
      {children}
    </AuthContext.Provider>
  );
};