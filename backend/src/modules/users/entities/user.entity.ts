import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserProfileType {
  OPERACIONAL = 'OPERACIONAL',
  GERENCIAL = 'GERENCIAL',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserProfileType,
    default: UserProfileType.OPERACIONAL,
  })
  profile_type: UserProfileType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
