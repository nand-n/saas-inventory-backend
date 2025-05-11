import { BaseModel } from "@root/src/database/base.model";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Branch } from "../../branchs/entities/branch.entity";
import { Tenant } from "../../tenants/entities/tenants.entity";

@Entity()
export class Expense extends BaseModel {
  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('enum', { enum: ['rent', 'salary', 'utility', 'other'] })
  category: 'rent' | 'salary' | 'utility' | 'other';

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column()
  branchId: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @CreateDateColumn()
  expenseDate: Date;
}
