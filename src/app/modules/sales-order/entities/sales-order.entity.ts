import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Customer } from '../../customers/entities/customers.entity';
import { SalesOrderItem } from './sales-order-item.entity';

export enum SalesOrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

@Entity('sales_orders')
export class SalesOrder extends BaseModel {
  @Column({ unique: true })
  soNumber: string;

  @ManyToOne(() => Customer, customer => customer.salesOrders)
  customer: Customer;

  @Column({ type: 'enum', enum: SalesOrderStatus, default: SalesOrderStatus.DRAFT })
  status: SalesOrderStatus;

  @Column('date')
  orderDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @OneToMany(() => SalesOrderItem, item => item.salesOrder, { cascade: true })
  items: SalesOrderItem[];

  
}
