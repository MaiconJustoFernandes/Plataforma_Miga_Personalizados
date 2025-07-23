import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
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
        try {
          // Valida o token buscando os dados do usuário
          const response = await api.get('/auth/profile');
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          // Se o token for inválido (ex: expirado), limpa o estado
          console.error("Sessão inválida, limpando token:", error);
          localStorage.removeItem('miga-token');
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
      
      // Após o login, buscar dados do usuário
      const userResponse = await api.get('/auth/profile');
      setUser(userResponse.data);
      
      notifications.show({
        title: 'Login realizado com sucesso!',
        message: 'Bem-vindo de volta à Plataforma Miga Personalizados',
        color: 'green',
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Tratamento de diferentes tipos de erro
      let errorMessage = 'Erro inesperado. Tente novamente.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      notifications.show({
        title: 'Erro no login',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      await api.post('/auth/register', data);
      
      notifications.show({
        title: 'Cadastro realizado com sucesso!',
        message: 'Agora você pode fazer login com suas credenciais',
        color: 'green',
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      // Tratamento de diferentes tipos de erro
      let errorMessage = 'Erro inesperado. Tente novamente.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      notifications.show({
        title: 'Erro no cadastro',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('miga-token');
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
