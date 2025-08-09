import { Entity, Column, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Shipment } from '../../shipment/entities/shipment.entity';
import { BaseModel } from '@root/src/database/base.model';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum OrderType {
  SALES = 'sales',
  PURCHASE = 'purchase',
  RETURN = 'return',
  EXCHANGE = 'exchange'
}

@Entity('orders')
export class Order extends BaseModel {

  @Column({ unique: true })
  orderNumber: string;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.SALES
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;


  @Column('decimal', { precision: 12, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  shippingAmount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  paymentStatus: string;

  @Column({ nullable: true })
  shippingMethod: string;

  @Column('json', { nullable: true })
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @Column({ nullable: true })
  expectedDeliveryDate: Date;

  @Column('text', { nullable: true })
  notes: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @OneToMany(() => Shipment, shipment => shipment.order)
  shipments: Shipment[];
}
