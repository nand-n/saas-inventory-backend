import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AccountCategory } from './account-category.entity';

@Entity()
export class ChartOfAccount extends BaseModel {
  @Column()
  name: string; // "Cash", "Accounts Payable"

  @ManyToOne(() => AccountCategory, { eager: true })
  category: AccountCategory;

  @Column({ unique: true })
  code: string; // "1010", "2010" (no hierarchy)

  @Column({ default: true })
  isActive: boolean;
}
