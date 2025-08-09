import { Entity, Column, ManyToOne } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Order } from './order.entity';
import { BaseModel } from '@root/src/database/base.model';

@Entity('order_items')
export class OrderItem extends BaseModel {

  @ManyToOne(() => Order, order => order.orderItems)
  order: Order;

  @ManyToOne(() => Product, product => product.orderItems)
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  finalPrice: number;

  @Column('text', { nullable: true })
  notes: string;
}
