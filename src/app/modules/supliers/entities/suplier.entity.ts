import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Product } from '../../product/entities/product.entity';
import { Shipment } from '../../shipment/entities/shipment.entity';
import { PurchaseOrder } from '../../purchase-order/entities/purchase-order.entity';
import { RFQ } from '../../rfq/entities/rfq.entity';
import { RFQSupplier } from '../../rfq/entities/rfq-supplier.entity';

export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLACKLISTED = 'blacklisted'
}

@Entity('suppliers')
export class Supplier extends BaseModel {

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  contactPerson: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column('json')
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    lat?:string
    lng?:string
  };

  @Column({
    type: 'enum',
    enum: SupplierStatus,
    default: SupplierStatus.ACTIVE
  })
  status: SupplierStatus;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  performanceRating: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  leadTimeDays: number;

  @Column({ nullable: true })
  paymentTerms: string;

  @Column('text', { nullable: true })
  notes: string;

  @OneToMany(() => Product, product => product.supplier , {
  cascade: ['insert', 'update', 'remove'],
})
  products: Product[];

  @OneToMany(() => Shipment, shipment => shipment.supplier)
  shipments: Shipment[];

  @ManyToOne(() => PurchaseOrder, (po) => po.supplier)
  purchaseOrders: PurchaseOrder;

  @OneToMany(() => RFQ, (rfq) => rfq.suppliers)
  rfqs: RFQ[];

  @OneToMany(() => RFQSupplier, (rfqSupplier) => rfqSupplier.supplier, {
  cascade: true,
})
rfqSuppliers: RFQSupplier[];
}
