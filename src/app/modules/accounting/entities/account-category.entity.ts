import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenants.entity';

export enum NormalBalance {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

@Entity()
@Index(['tenant', 'code'], { unique: true })
export class AccountCategory extends BaseModel {
  @ManyToOne(() => Tenant, { eager: true })
  tenant: Tenant;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isSystem: boolean;

  @Column({ default: false })
  readonly: boolean;
}
