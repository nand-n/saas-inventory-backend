import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Supplier } from '../../supliers/entities/suplier.entity';
import { RFQ } from '../../rfq/entities/rfq.entity';

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  APPROVED = 'approved',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

@Entity('purchase_orders')
export class PurchaseOrder extends BaseModel {
  @Column({ unique: true })
  poNumber: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchaseOrders)
  supplier: Supplier;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;

  @Column('date')
  orderDate: Date;

  @Column('date', { nullable: true })
  expectedDeliveryDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @OneToMany(() => PurchaseOrderItem, (poi) => poi.purchaseOrder, { cascade: true })
  items: PurchaseOrderItem[];

  @OneToMany(() => RFQ, (rfq) => rfq.awardedPurchaseOrder)
  rfqs: RFQ[];
}
