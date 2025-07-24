import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Insum } from '../../insums/entities/insum.entity';

@Entity('product_composition')
export class ProductComposition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, product => product.composition, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Insum, { eager: true })
  @JoinColumn({ name: 'insum_id' })
  insum: Insum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityUsed: number;
}
