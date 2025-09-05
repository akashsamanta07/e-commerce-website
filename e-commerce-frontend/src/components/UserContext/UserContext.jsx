// UserContext.jsx (updated)
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const GlobalContext = createContext();

// Helper functions for localStorage
const getLocalStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// Create a provider component
export const UserContext = ({ children }) => {
  const [total, setTotal] = useState(() => getLocalStorage('total', 0));
  const [current, setCurrent] = useState(() => getLocalStorage('current', {}));
  const [catname, setCatname] = useState(() => getLocalStorage('catname', ''));

  // Persist total to localStorage
  useEffect(() => {
    setLocalStorage('total', total);
  }, [total]);

  // Persist current to localStorage
  useEffect(() => {
    setLocalStorage('current', current);
  }, [current]);

  // Persist catname to localStorage
  useEffect(() => {
    setLocalStorage('catname', catname);
  }, [catname]);

  return (
    <GlobalContext.Provider value={{ total, setTotal, current, setCurrent, catname, setCatname }}>
      {children}
    </GlobalContext.Provider>
  );
};
