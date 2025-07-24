import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('insums')
export class Insum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, name: 'unit_of_measurement' })
  unitOfMeasurement: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'current_stock' })
  currentStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'average_cost' })
  averageCost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
