import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Track if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // When the app starts, check if user is already logged 
  useEffect(() => {
    const checkIfUserIsLoggedIn = () => {
      // Check localStorage for login status
      const isLoggedIn = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(isLoggedIn);
      setIsLoading(false);
    };
    checkIfUserIsLoggedIn();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Clear all stored user data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  };

  // Show loading message while checking login status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Provide login state and functions to all children components
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
