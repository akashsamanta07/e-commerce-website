// GlobalContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const GlobalContext = createContext();

// Create a provider component
export const UserContext = ({ children }) => {
  const [total,setTotal] = useState(0);

  return (
    <GlobalContext.Provider value={{ total,setTotal }}>
      {children}
    </GlobalContext.Provider>
  );
};
