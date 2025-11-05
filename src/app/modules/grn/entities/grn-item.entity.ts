import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { GoodsReceipt } from './grn.entity';
import { PurchaseOrderItem } from '../../purchase-order/entities/purchase-order-item.entity';

@Entity('goods_receipt_items')
export class GRNItem extends BaseModel {
  @ManyToOne(() => GoodsReceipt, (grn) => grn.items, { onDelete: 'CASCADE' })
  grn: GoodsReceipt;

  // Link to specific PO line item
  @ManyToOne(() => PurchaseOrderItem, { nullable: true })
  poItem?: PurchaseOrderItem;

  @Column()
  name: string;

  @Column('int')
  receivedQuantity: number;

  // Unit of measure
  @Column({ default: 'pcs' })
  unit: string;

  // Batch / expiry
  @Column({ nullable: true })
  batchNumber?: string;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  // Quality Control / inspection
  @Column({ nullable: true })
  qcStatus?: 'PASSED' | 'FAILED' | 'PENDING';

  @Column({ nullable: true })
  qcRemarks?: string;

  // Optional: track remaining quantity for partial receipts
  @Column({ type: 'int', nullable: true })
  pendingQuantity?: number;
}
