import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductComposition } from './product-composition.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  productionCost: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  profitMargin: number;

  @OneToMany(() => ProductComposition, composition => composition.product, { cascade: true })
  composition: ProductComposition[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
