import { Entity, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Tenant } from '../../tenants/entities/tenants.entity';
import { Branch } from '../../branchs/entities/branch.entity';

@Entity()
export class Transaction extends BaseModel {
@Column('enum', { enum: ['sale', 'expense', 'refund', 'payment'] })
  @Column()
  type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  reference: string;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column()
  branchId: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @CreateDateColumn()
  transactionDate: Date;
}
