import api from './api';
import type { Order } from '../types/order';

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (orderData: any): Promise<Order> => {
  const response = await api.post('/orders', orderData);
  return response.data;
};
