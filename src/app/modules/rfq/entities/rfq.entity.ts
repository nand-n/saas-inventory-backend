import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { RFQItem } from './rfq-item.entity';
import { RFQSupplier } from './rfq-supplier.entity';
import { PurchaseOrder } from '../../purchase-order/entities/purchase-order.entity';

export enum RFQStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  RECEIVED = 'received',
  QUOTED = 'quoted',
  REJECTED = 'rejected',
  AWARDED = 'awarded',
  CLOSED = 'closed',
}

@Entity('rfqs')
export class RFQ extends BaseModel {
  @Column({ unique: true })
  rfqNumber: string;

  @Column({
    type: 'enum',
    enum: RFQStatus,
    default: RFQStatus.DRAFT,
  })
  status: RFQStatus;

  @Column({ type: 'timestamp', nullable: true })
  issuedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column('text', { nullable: true })
  termsAndConditions: string;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  totalAmount: number;

  // ✅ Multiple items under one RFQ
  @OneToMany(() => RFQItem, (item) => item.rfq, { cascade: true })
  items: RFQItem[];

  // ✅ Multiple suppliers linked to one RFQ
  @OneToMany(() => RFQSupplier, (rfqSupplier) => rfqSupplier.rfq, {
    cascade: true,
  })
  suppliers: RFQSupplier[];

  // ✅ Purchase order after awarding
  @OneToMany(() => PurchaseOrder, (po) => po.rfqs, { nullable: true })
  purchaseOrders: PurchaseOrder[];
}
