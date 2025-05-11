import { BaseModel } from "@root/src/database/base.model";
import { Column, Entity, ManyToOne } from "typeorm";
import { Tenant } from "../../tenants/entities/tenants.entity";
import { Branch } from "../../branchs/entities/branch.entity";

@Entity()
export class CustomerInvoice extends BaseModel {
  @Column()
  invoiceNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

    @Column({
      type: "enum",
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    })
    status: "paid" | "pending" | "overdue";
  @Column()
  dueDate: Date;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column()
  branchId: string;
}
