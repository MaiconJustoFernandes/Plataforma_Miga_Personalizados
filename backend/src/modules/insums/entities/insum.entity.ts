import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('insums')
export class Insum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  unitOfMeasure: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  averageCost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
