import { BaseModel } from "@root/src/database/base.model";
import { Column, Entity, ManyToOne } from "typeorm";
import { Tenant } from "../../tenants/entities/tenants.entity";

@Entity()
export class BankAccount extends BaseModel {
  @Column()
  accountName: string;

  @Column()
  bankName: string;

  @Column()
  accountNumber: string;

  @Column()
  currency: string; // 'USD', 'ETB', etc.

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: string;
}
