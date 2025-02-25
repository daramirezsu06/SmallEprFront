// contexts/authContext.tsx
"use client";

import postLogin from "@/api/auth/login";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Tipos para la respuesta del backend y el usuario
interface LoginResponse {
  token: string;
  name: string;
  role: string;
}

interface User {
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setUser({ ...JSON.parse(storedUser), token: storedToken });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response: LoginResponse = await postLogin({ email, password });
    const userData: User = {
      email,
      name: response.name,
      role: response.role,
      token: response.token,
    };
    setUser(userData);
    localStorage.setItem("token", response.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ email, name: response.name, role: response.role })
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook tipado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
