import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { SalesOrder } from './sales-order.entity';

@Entity('sales_order_items')
export class SalesOrderItem extends BaseModel {
  @ManyToOne(() => SalesOrder, so => so.items)
  salesOrder: SalesOrder;

  @Column()
  productName: string;

  @Column()
  productId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2 })
  lineTotal: number;
}
