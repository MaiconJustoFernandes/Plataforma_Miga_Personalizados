import axios from 'axios';
import type { CreateProductData } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Busca todos os produtos
export const getProducts = async (token: string) => {
  const response = await axios.get(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Busca um produto pelo ID
export const getProductById = async (id: string, token: string) => {
  const response = await axios.get(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Cria um novo produto
export const createProduct = async (productData: CreateProductData, token: string) => {
  const response = await axios.post(`${API_URL}/products`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Atualiza um produto existente
export const updateProduct = async (id: string, productData: Partial<CreateProductData>, token: string) => {
  const response = await axios.put(`${API_URL}/products/${id}`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Deleta um produto
export const deleteProduct = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
