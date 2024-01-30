import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn() 
  id: number;
  
  @Column({ length: 255 })
  name: string;
  
  @Column({ length: 255 })
  email: string;
  
  @Column({ length: 255 })
  role: string;
  
  @Column({ length: 255 })
  password: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date;
  
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updated_at: Date;
  
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}