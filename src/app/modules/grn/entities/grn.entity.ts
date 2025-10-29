import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { PurchaseOrder } from '../../purchase-order/entities/purchase-order.entity';
import { GRNItem } from './grn-item.entity';

@Entity('goods_receipts')
export class GoodsReceipt extends BaseModel {
  @Column({ unique: true })
  grnNumber: string;

  @ManyToOne(() => PurchaseOrder, (po) => po.items)
  purchaseOrder: PurchaseOrder;

  @Column({ type: 'date' })
  receivedDate: Date;

  @Column({ nullable: true })
  receivedBy?: string;

  @OneToMany(() => GRNItem, (item) => item.grn, { cascade: true })
  items: GRNItem[];
}
