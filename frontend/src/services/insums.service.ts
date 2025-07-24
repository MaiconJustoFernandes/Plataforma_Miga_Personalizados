import axios from 'axios';
import type { Insum } from '../types/insum';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Busca todos os insumos
export const getInsums = async (token: string) => {
  const response = await axios.get(`${API_URL}/insums`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Busca um insumo pelo ID
export const getInsumById = async (id: string, token: string) => {
  const response = await axios.get(`${API_URL}/insums/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Cria um novo insumo
export const createInsum = async (insumData: Omit<Insum, 'id' | 'createdAt' | 'updatedAt'>, token: string) => {
  const response = await axios.post(`${API_URL}/insums`, insumData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Atualiza um insumo existente
export const updateInsum = async (id: string, insumData: Partial<Insum>, token: string) => {
  const response = await axios.put(`${API_URL}/insums/${id}`, insumData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Deleta um insumo
export const deleteInsum = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/insums/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
