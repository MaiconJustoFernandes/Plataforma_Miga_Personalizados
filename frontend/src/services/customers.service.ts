import axios from 'axios';
import type { Customer } from '../types/customer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Busca todos os clientes
export const getCustomers = async (token: string) => {
  const response = await axios.get(`${API_URL}/customers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Busca um cliente pelo ID
export const getCustomer = async (id: string, token: string) => {
  const response = await axios.get(`${API_URL}/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Alias para compatibilidade
export const getCustomerById = getCustomer;

// Cria um novo cliente
export const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>, token: string) => {
  const response = await axios.post(`${API_URL}/customers`, customerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Atualiza um cliente existente
export const updateCustomer = async (id: string, customerData: Partial<Customer>, token: string) => {
  const response = await axios.put(`${API_URL}/customers/${id}`, customerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Deleta um cliente
export const deleteCustomer = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
