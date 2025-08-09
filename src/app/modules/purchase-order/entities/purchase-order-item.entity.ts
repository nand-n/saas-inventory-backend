import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem extends BaseModel {
  @ManyToOne(() => PurchaseOrder, (po) => po.items)
  purchaseOrder: PurchaseOrder;

  @Column()
  productName: string;

  @Column()
  productId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_cost: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2 })
  lineTotal: number;
}
