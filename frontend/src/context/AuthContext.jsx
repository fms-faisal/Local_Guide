import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const storedToken = localStorage.getItem('token');
const storedRole = localStorage.getItem('role');

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedToken ? { role: storedRole } : null);

  useEffect(() => {
    if (token) {
      const role = localStorage.getItem('role');
      setUser({ role });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (token, role) => {
    setToken(token);
    setUser({ role });
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
