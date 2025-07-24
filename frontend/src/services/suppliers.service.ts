import axios from 'axios';
import type { Supplier } from '../types/supplier';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Busca todos os fornecedores
export const getSuppliers = async (token: string) => {
  const response = await axios.get(`${API_URL}/suppliers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Busca um fornecedor pelo ID
export const getSupplierById = async (id: string, token: string) => {
  const response = await axios.get(`${API_URL}/suppliers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Cria um novo fornecedor
export const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>, token: string) => {
  const response = await axios.post(`${API_URL}/suppliers`, supplierData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Atualiza um fornecedor existente
export const updateSupplier = async (id: string, supplierData: Partial<Supplier>, token: string) => {
  const response = await axios.put(`${API_URL}/suppliers/${id}`, supplierData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Deleta um fornecedor
export const deleteSupplier = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/suppliers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
