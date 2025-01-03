import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
          const [token, setToken] = useState(null);
          const [userData, setUserData] = useState(null);
          const [isAuthenticated, setisAuthenticated] = useState(false);

          useEffect(() => {
                    const storedData = JSON.parse(localStorage.getItem('user_data'));
                    if (storedData) {
                              const { userToken, user } = storedData; // Destructure as an object
                              setToken(userToken);
                              setUserData(user);
                              setisAuthenticated(true);
                    }
          }, []);

          const login = (newToken, newData) => {
                    localStorage.setItem(
                              'user_data',
                              JSON.stringify({ userToken: newToken, user: newData })
                    );

                    setToken(newToken);
                    setUserData(newData);
                    setisAuthenticated(true);
          };

          const logout = () => {
                    localStorage.removeItem('user_data');
                    setToken(null);
                    setUserData(null);
                    setisAuthenticated(false);
          };

          return (
                    <AuthContext.Provider
                              value={{ token, login, logout, isAuthenticated, userData }}
                    >
                              {children}
                    </AuthContext.Provider>
          );
};

export const useAuth = () => useContext(AuthContext);
