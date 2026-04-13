import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginCustomer, registerCustomer } from '../lib/medusa';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to quickly restore session from local storage since cross-origin cookies can be blocked
    const storedUser = localStorage.getItem('medusa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await loginCustomer(email, password);
    if (result.customer) {
      setUser(result.customer);
      localStorage.setItem('medusa_user', JSON.stringify(result.customer));
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = async (firstName, lastName, email, password) => {
    const result = await registerCustomer(firstName, lastName, email, password);
    if (result.customer) {
      setUser(result.customer);
      localStorage.setItem('medusa_user', JSON.stringify(result.customer));
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medusa_user');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
