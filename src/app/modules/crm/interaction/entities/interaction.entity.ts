import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CRMCustomer } from '../../customer/entities/customer.entity';
import { BaseModel } from '@root/src/database/base.model';

export enum InteractionType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  NOTE = 'note',
}

@Entity('crm_interactions')
export class Interaction  extends BaseModel {

  @ManyToOne(() => CRMCustomer, (customer) => customer.interactions, { onDelete: 'CASCADE' })
  customer: CRMCustomer;

  @Column({ type: 'enum', enum: InteractionType })
  type: InteractionType;

  @Column('text')
  description: string;
}
