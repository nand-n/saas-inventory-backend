import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CRMCustomer } from '../../customer/entities/customer.entity';
import { BaseModel } from '@root/src/database/base.model';

export enum OpportunityStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  WON = 'won',
  LOST = 'lost',
}

@Entity('crm_opportunities')
export class Opportunity  extends BaseModel {

  @ManyToOne(() => CRMCustomer, (customer) => customer.opportunities, { onDelete: 'CASCADE' })
  customer: CRMCustomer;

  @Column()
  title: string;

  @Column({ type: 'decimal', nullable: true })
  estimatedValue?: number;

  @Column({ type: 'enum', enum: OpportunityStatus, default: OpportunityStatus.NEW })
  status: OpportunityStatus;

  @Column({ nullable: true })
  expectedClosingDate?: Date;

}
