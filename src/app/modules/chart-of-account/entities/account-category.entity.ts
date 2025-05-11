import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenants.entity';

@Entity()
export class AccountCategory extends BaseModel {
  @Column({ unique: true })
  name: string; // "Assets", "Liabilities", etc.

  @Column({ unique: true })
  code: string; // "1-ASSET", "2-LIABILITY"

  @Column()
  normalBalance: 'debit' | 'credit';
}
