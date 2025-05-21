import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { AccountCategory } from './account-category.entity';
import { Tenant } from '../../tenants/entities/tenants.entity';

export enum CashFlowCategory {
  OPERATING = 'operating',
  INVESTING = 'investing',
  FINANCING = 'financing',
}
@Entity()
@Index(['tenant', 'name', 'code'], { unique: true })
export class ChartOfAccount extends BaseModel {
  @ManyToOne(() => Tenant, { eager: true })
  tenant: Tenant;

  @Column()
  name: string;

  @Column()
  code: string;

  @ManyToOne(() => AccountCategory, { eager: true })
  category: AccountCategory;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => ChartOfAccount, (coa) => coa.children, { nullable: true })
  parent: ChartOfAccount;

  @OneToMany(() => ChartOfAccount, (coa) => coa.parent)
  children: ChartOfAccount[];

  @Column({ default: false })
  isLeaf: boolean;

  @Column({ type: 'enum', enum: CashFlowCategory, nullable: true })
  cashFlowCategory: CashFlowCategory;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  readOnly: boolean;
}
