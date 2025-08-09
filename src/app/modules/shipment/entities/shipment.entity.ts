import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Supplier } from '../../supliers/entities/suplier.entity';
import { CustomsDocument } from '../../customs-document/entities/customs-document.entity';
import { Order } from '../../order/entities/order.entity';
import { BaseModel } from '@root/src/database/base.model';
import { PurchaseOrder } from '../../purchase-order/entities/purchase-order.entity';
import { Customer } from '../../customers/entities/customers.entity';
import { SalesOrder } from '../../sales-order/entities/sales-order.entity';

export enum ShipmentStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  IN_CUSTOMS = 'in_customs',
  CLEARED = 'cleared',
  DELIVERED = 'delivered',
  DELAYED = 'delayed',
  RETURNED = 'returned'
}

export enum ShipmentType {
  IMPORT = 'import',
  EXPORT = 'export',
  DOMESTIC = 'domestic'
}

@Entity('shipments')
export class Shipment  extends BaseModel {

  @Column({ unique: true })
  trackingNumber!: string;

  @Column({
    type: 'enum',
    enum: ShipmentType,
    default: ShipmentType.DOMESTIC
  })
  type!: ShipmentType;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.PENDING
  })
  status!: ShipmentStatus;

  @ManyToOne(() => Order, order => order.shipments, { nullable: true })
  order!: Order;

  @ManyToOne(() => Supplier, supplier => supplier.shipments, { nullable: true })
  supplier!: Supplier;

  @Column()
  carrier!: string;

  @Column('json')
  originAddress!: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @Column('json')
  destinationAddress!: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @Column({ nullable: true })
  shippedDate!: Date;

  @Column({ nullable: true })
  estimatedDeliveryDate!: Date;

  @Column({ nullable: true })
  actualDeliveryDate!: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  weight!: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shippingCost!: number;

  @Column({ nullable: true })
  containerNumber!: string;

  @Column({ nullable: true })
  vesselName!: string;

  @Column({ nullable: true })
  portOfLoading!: string;

  @Column({ nullable: true })
  portOfDischarge!: string;

  @Column('json', { nullable: true })
  customsInfo!: {
    declarationNumber: string;
    dutyAmount: number;
    taxAmount: number;
    clearanceDate: Date;
  };

  @Column('text', { nullable: true })
  notes!: string;

  @OneToMany(() => CustomsDocument, customsDocument => customsDocument.shipment)
  customsDocuments!: CustomsDocument[];

  @OneToMany(() => PurchaseOrder, (po) => po.supplier)
  purchaseOrders: PurchaseOrder[];

    @OneToMany(() => SalesOrder, (po) => po.customer)
  salesOrders: SalesOrder[];

  @ManyToOne(() => Customer, customer => customer.shipments, { nullable: true })
  customer: Customer;
}
