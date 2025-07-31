import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer } from '../customers/entities/customer.entity';
import { Product } from '../products/entities/product.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();

    const datePrefix = `PROD-${d}${m}${y}`;

    const lastOrder = await this.orderRepository.findOne({
      where: { order_number: Like(`${datePrefix}%`) },
      order: { order_number: 'DESC' },
    });

    let nextSequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.order_number.slice(-4), 10);
      nextSequence = lastSequence + 1;
    }

    return `${datePrefix}${String(nextSequence).padStart(4, '0')}`;
  }

  @Transactional()
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      customerId,
      items,
      shippingCost = 0,
      discountValue = 0,
      // couponCode, // A lógica do cupom será implementada na Fase 5
      ...orderData
    } = createOrderDto;

    const customer = await this.customerRepository.findOneBy({ id: customerId });
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${customerId} não encontrado.`);
    }

    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const itemDto of items) {
      const product = await this.productRepository.findOneBy({ id: itemDto.productId });
      if (!product) {
        throw new NotFoundException(`Produto com ID ${itemDto.productId} não encontrado.`);
      }
      const unitPrice = product.salePrice;
      subtotal += unitPrice * itemDto.quantity;

      const orderItem = this.orderItemRepository.create({
        ...itemDto,
        product,
        unit_price: unitPrice,
      });
      orderItems.push(orderItem);
    }

    // Lógica de desconto do cupom será adicionada aqui no futuro
    const couponDiscount = 0;

    const totalValue = subtotal + shippingCost - discountValue - couponDiscount;

    const order = this.orderRepository.create({
      ...orderData,
      customer,
      order_number: await this.generateOrderNumber(),
      subtotal,
      shipping_cost: shippingCost,
      discount_value: discountValue,
      total_value: totalValue,
      status: 'PAGAMENTO_PENDENTE', // Status inicial
      // coupon_id: coupon ? coupon.id : null,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const item of orderItems) {
      item.order = savedOrder;
      await this.orderItemRepository.save(item);
    }

    return savedOrder;
  }

  findAll() {
    return this.orderRepository.find({ relations: ['customer', 'items', 'items.product'] });
  }

  findOne(id: string) {
    return this.orderRepository.findOne({ where: { id }, relations: ['customer', 'items', 'items.product'] });
  }

  update(id: number, updateOrderDto: any) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
