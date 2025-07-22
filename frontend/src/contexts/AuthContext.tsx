import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Define a forma dos dados do usuário
interface User {
  id: number;
  name: string;
  email: string;
  profile_type: 'OPERACIONAL' | 'GERENCIAL';
}

// Define a forma do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('miga-token');
      if (storedToken) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        try {
          // Valida o token buscando os dados do usuário
          const response = await api.get('/auth/profile');
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          // Se o token for inválido (ex: expirado), limpa o estado
          console.error("Sessão inválida, limpando token:", error);
          localStorage.removeItem('miga-token');
          api.defaults.headers.Authorization = null;
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('miga-token', access_token);
      api.defaults.headers.Authorization = `Bearer ${access_token}`;
      // Após o login, buscar dados do usuário
      const userResponse = await api.get('/auth/profile');
      setUser(userResponse.data);
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      // Adicionar tratamento de erro para o usuário
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      await api.post('/auth/register', data);
      navigate('/login');
    } catch (error) {
      console.error('Erro no registro:', error);
      // Adicionar tratamento de erro para o usuário
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('miga-token');
    api.defaults.headers.Authorization = null;
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
