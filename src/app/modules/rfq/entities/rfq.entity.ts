import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { RFQItem } from './rfq-item.entity';
import { PurchaseOrder } from '../../purchase-order/entities/purchase-order.entity';
import { Supplier } from '../../supliers/entities/suplier.entity';

export enum RFQStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  RECEIVED = 'received',
  QUOTED = 'quoted',
  REJECTED = 'rejected',
  AWARDED = 'awarded',
  CLOSED = 'closed'
}

@Entity('rfqs')
export class RFQ extends BaseModel {

  @Column({ unique: true })
  rfqNumber: string;

  @ManyToOne(() => Supplier, supplier => supplier.rfqs, { nullable: true })
  supplier: Supplier;

  @Column({
    type: 'enum',
    enum: RFQStatus,
    default: RFQStatus.DRAFT
  })
  status: RFQStatus;

  @Column({ nullable: true })
  issuedDate: Date;

  @Column({ nullable: true })
  validUntil: Date;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  totalAmount: number;

  @Column('text', { nullable: true })
  termsAndConditions: string;

  @OneToMany(() => RFQItem, (item) => item.rfq, {
    cascade: true
  })
  items: RFQItem[];

  @ManyToOne(() => PurchaseOrder, (po) => po.rfqs, { nullable: true })
  awardedPurchaseOrder: PurchaseOrder;
}
