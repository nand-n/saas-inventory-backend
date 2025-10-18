import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Opportunity } from '../../opportunity/entities/opportunity.entity';
import { Interaction } from '../../interaction/entities/interaction.entity';
import { BaseModel } from '@root/src/database/base.model';

export enum CustomerType {
  IMPORTER = 'importer',
  EXPORTER = 'exporter',
  RETAILER = 'retailer',
}

@Entity('crm_customers')
export class CRMCustomer extends  BaseModel {

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ type: 'enum', enum: CustomerType })
  type: CustomerType;

  @OneToMany(() => Opportunity, (opportunity) => opportunity.customer)
  opportunities: Opportunity[];

  @OneToMany(() => Interaction, (interaction) => interaction.customer)
  interactions: Interaction[];
}
