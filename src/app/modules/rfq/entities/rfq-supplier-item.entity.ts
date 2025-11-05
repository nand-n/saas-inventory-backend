import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { RFQSupplier } from './rfq-supplier.entity';
import { RFQItem } from './rfq-item.entity';

@Entity('rfq_supplier_items')
export class RFQSupplierItem extends BaseModel {
  @ManyToOne(() => RFQSupplier, (rfqSupplier) => rfqSupplier.items)
  rfqSupplier: RFQSupplier;

  @ManyToOne(() => RFQItem, (rfqItem) => rfqItem.id)
  rfqItem: RFQItem;

  @Column('int')
  quantity: number;

  // Quantity supplier commits to deliver (might differ from RFQ quantity)
  @Column('int', { nullable: true })
  committedQty: number;


  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalPrice: number;

  /** --- Comparison details --- **/
  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

   // Lead Time in days (LT column)
  @Column({ type: 'int', nullable: true })
  leadTime: number;

  // Revision letter or code, e.g., "A", "B", etc.
  @Column({ type: 'varchar', length: 5, nullable: true })
  revision: string;

   // Optional note from supplier
  @Column('text', { nullable: true })
  note: string;

  /** --- Awarding section --- **/
  @Column({ type: 'boolean', default: false })
  isSelected: boolean;

  @Column({ type: 'boolean', default: false })
  isAwarded: boolean;

  @Column({ type: 'timestamp', nullable: true })
  awardedAt: Date;

  /** --- Meta section --- **/
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  taxAmount: number;

}
