import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { createOrder } from '../services/orders.service';
import { getCustomers } from '../services/customers.service';
import { getProducts } from '../services/products.service';
import { useAuth } from '../contexts/AuthContext';
import type { Customer } from '../types/customer';
import type { Product } from '../types/product';
import type { PaymentCondition } from '../types/order';

interface IFormInput {
  customerId: string;
  dueDate: string;
  deliveryType: string;
  shippingCost: number;
  discountValue: number;
  couponCode: string;
  paymentCondition: PaymentCondition;
  items: {
    productId: string;
    quantity: number;
    color: string;
    size: string;
    notes: string;
  }[];
}

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const { register, control, handleSubmit, watch } = useForm<IFormInput>({
    defaultValues: {
      customerId: '',
      dueDate: '',
      deliveryType: '',
      shippingCost: 0,
      discountValue: 0,
      couponCode: '',
      paymentCondition: 'PIX_100',
      items: [{ productId: '', quantity: 1, color: '', size: '', notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedShippingCost = watch('shippingCost');
  const watchedDiscountValue = watch('discountValue');

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) return;
      try {
        const [customersData, productsData] = await Promise.all([
          getCustomers(token),
          getProducts(token),
        ]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      }
    };
    fetchInitialData();
  }, [token]);

  useEffect(() => {
    const calculateTotal = () => {
      const subtotal = watchedItems.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        const quantity = item.quantity || 0;
        return sum + (product ? product.salePrice * quantity : 0);
      }, 0);
      const finalTotal = subtotal + (watchedShippingCost || 0) - (watchedDiscountValue || 0);
      setTotal(finalTotal);
    };
    calculateTotal();
  }, [watchedItems, watchedShippingCost, watchedDiscountValue, products]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Filtrar itens que não tem produto selecionado
      const payload = {
        ...data,
        items: data.items.filter(item => item.productId),
      };
      await createOrder(payload);
      navigate('/orders');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Novo Pedido</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Customer and Dates */}
        <div className="p-4 border rounded">
          <h2 className="text-xl mb-2">Informações Gerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Cliente</label>
              <select {...register('customerId')} className="w-full p-2 border rounded">
                <option value="">Selecione um cliente</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Data de Entrega</label>
              <input type="date" {...register('dueDate')} className="w-full p-2 border rounded" />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-4 border rounded">
          <h2 className="text-xl mb-2">Itens do Pedido</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 p-2 border-b">
              <select {...register(`items.${index}.productId`)} className="p-2 border rounded">
                <option value="">Selecione um produto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })} className="p-2 border rounded" placeholder="Qtd" />
              <input {...register(`items.${index}.color`)} className="p-2 border rounded" placeholder="Cor" />
              <input {...register(`items.${index}.size`)} className="p-2 border rounded" placeholder="Tamanho" />
              <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white p-2 rounded">Remover</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ productId: '', quantity: 1, color: '', size: '', notes: '' })} className="bg-blue-500 text-white p-2 rounded mt-2">
            Adicionar Item
          </button>
        </div>

        {/* Financial Summary */}
        <div className="p-4 border rounded">
          <h2 className="text-xl mb-2">Resumo Financeiro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Frete (R$)</label>
              <input type="number" {...register('shippingCost', { valueAsNumber: true })} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Desconto Manual (R$)</label>
              <input type="number" {...register('discountValue', { valueAsNumber: true })} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Cupom de Desconto</label>
              <input {...register('couponCode')} className="w-full p-2 border rounded" placeholder="Código do cupom" />
            </div>
          </div>
          <div className="mt-4 text-right">
            <h3 className="text-2xl font-bold">TOTAL: R$ {total.toFixed(2)}</h3>
          </div>
        </div>

        {/* Payment Conditions */}
        <div className="p-4 border rounded">
          <h2 className="text-xl mb-2">Condições de Pagamento</h2>
          <div className="space-y-2">
            <div>
              <input type="radio" value="PIX_100" {...register('paymentCondition')} id="pix100" />
              <label htmlFor="pix100" className="ml-2">PIX - 100% no ato</label>
            </div>
            <div>
              <input type="radio" value="PIX_50_50" {...register('paymentCondition')} id="pix5050" />
              <label htmlFor="pix5050" className="ml-2">PIX - 50% no ato, 50% antes do envio</label>
            </div>
            <div>
              <input type="radio" value="CARTAO_CREDITO_100" {...register('paymentCondition')} id="cc100" />
              <label htmlFor="cc100" className="ml-2">Cartão de Crédito - 100% no ato</label>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-green-500 text-white p-3 rounded font-bold">
          Salvar Pedido
        </button>
      </form>
    </div>
  );
};

export default CreateOrderPage;
