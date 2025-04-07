import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Track if user is logged in and store user data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // When the app starts, check if user is already logged 
  useEffect(() => {
    const checkIfUserIsLoggedIn = () => {
      // Check localStorage for login status and user data
      const isLoggedIn = localStorage.getItem("isAuthenticated") === "true";
      const storedUserData = localStorage.getItem("userData");
      
      setIsAuthenticated(isLoggedIn);
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
      setIsLoading(false);
    };
    checkIfUserIsLoggedIn();
  }, []);

  const login = (user) => {
    setIsAuthenticated(true);
    setUserData(user);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userData", JSON.stringify(user));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    // Clear all stored user data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
  };

  // Show loading message while checking login status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Provide login state, user data, and functions to all children components
  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to use authentication in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
