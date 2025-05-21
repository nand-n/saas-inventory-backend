import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Journal } from './journal.entity';
import { ChartOfAccount } from './chart-of-account.entity';
import { Tenant } from '../../tenants/entities/tenants.entity';

@Entity()
export class JournalLine extends BaseModel {
  @ManyToOne(() => Journal, (j) => j.lines)
  journal: Journal;

  @ManyToOne(() => ChartOfAccount, { eager: true })
  account: ChartOfAccount;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  debit: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  credit: number;

  @ManyToOne(() => Tenant, { eager: true })
  tenant: Tenant;
}
