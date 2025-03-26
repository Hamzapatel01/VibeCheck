import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a new context for authentication
const AuthContext = createContext(null);

// This component will provide login/logout functionality to our app
export const AuthProvider = ({ children }) => {
  // Track if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Track if we're checking login status
  const [isLoading, setIsLoading] = useState(true);

  // When the app starts, check if user is already logged in
  useEffect(() => {
    const checkIfUserIsLoggedIn = () => {
      // Check localStorage for login status
      const isLoggedIn = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(isLoggedIn);
      setIsLoading(false);
    };
    checkIfUserIsLoggedIn();
  }, []);

  // Function to log user in
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  // Function to log user out
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