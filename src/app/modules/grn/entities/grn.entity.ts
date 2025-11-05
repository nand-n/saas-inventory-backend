import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { PurchaseOrder } from '../../purchase-order/entities/purchase-order.entity';
import { GRNItem } from './grn-item.entity';

export enum GoodsReceiptStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum GRNQCStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

@Entity('goods_receipts')
export class GoodsReceipt extends BaseModel {
  @Column({ unique: true })
  grnNumber: string;

  // Link to Purchase Order
  @ManyToOne(() => PurchaseOrder, (po) => po.items)
  purchaseOrder: PurchaseOrder;

  @Column({ type: 'date' })
  receivedDate: Date;

  @Column({ nullable: true })
  receivedBy?: string;

  // Warehouse / location
  @Column({ nullable: true })
  warehouse?: string;

  // Status / Approval workflow
  @Column({ type: 'enum', enum: GoodsReceiptStatus, default: GoodsReceiptStatus.PENDING })
  status: GoodsReceiptStatus;

  // Audit trail
  @Column({ nullable: true })
  verifiedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  // GRN-level QC summary
  @Column({ type: 'enum', enum: GRNQCStatus, nullable: true })
  qcStatus?: GRNQCStatus;

  @Column({ type: 'text', nullable: true })
  qcRemarks?: string;

  @OneToMany(() => GRNItem, (item) => item.grn, { cascade: true })
  items: GRNItem[];
}
