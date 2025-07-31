import { Customer } from './customer';
import { Product } from './product';

export type OrderStatus =
  | 'APROVACAO_PENDENTE'
  | 'PAGAMENTO_PENDENTE'
  | 'AJUSTE_SOLICITADO'
  | 'EM_PRODUCAO_CORTE'
  | 'EM_PRODUCAO_ESTAMPARIA'
  | 'EM_PRODUCAO_CONFECCAO'
  | 'PRONTO_PARA_ENVIO'
  | 'ENVIADO'
  | 'AGUARDANDO_PAGAMENTO_FINAL';

export type PaymentCondition = 'PIX_100' | 'PIX_50_50' | 'CARTAO_CREDITO_100';

export type PaymentStatus = 'AGUARDANDO_PAGAMENTO' | 'PAGO_PARCIALMENTE' | 'PAGO_TOTALMENTE';

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  color?: string;
  size?: string;
  notes?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer: Customer;
  status: OrderStatus;
  order_date: string;
  due_date: string;
  delivery_type?: string;
  subtotal: number;
  shipping_cost?: number;
  discount_value?: number;
  total_value: number;
  coupon_id?: number;
  payment_condition: PaymentCondition;
  payment_status: PaymentStatus;
  items: OrderItem[];
}
