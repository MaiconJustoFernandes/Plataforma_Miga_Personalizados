import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
// A entidade Coupon será criada em uma fase futura, por enquanto usamos uma referência simples.
// import { Coupon } from '../../coupons/entities/coupon.entity';

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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  order_number: string;

  @ManyToOne(() => Customer, { eager: true })
  customer: Customer;

  @Column({
    type: 'varchar',
    length: 50,
  })
  status: OrderStatus;

  @CreateDateColumn()
  order_date: Date;

  @Column()
  due_date: Date;

  @Column({ nullable: true })
  delivery_type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shipping_cost: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount_value: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_value: number;

  // @ManyToOne(() => Coupon, { nullable: true })
  // coupon: Coupon;
  @Column({ nullable: true })
  coupon_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  payment_condition: PaymentCondition;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'AGUARDANDO_PAGAMENTO',
  })
  payment_status: PaymentStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}
