import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Shipment } from '../../shipment/entities/shipment.entity';
import { SalesOrder } from '../../sales-order/entities/sales-order.entity';
import { Product } from '../../product/entities/product.entity';

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('customers')
export class Customer extends BaseModel {
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
  };

  @Column({ type: 'enum', enum: CustomerStatus, default: CustomerStatus.ACTIVE })
  status: CustomerStatus;

  @OneToMany(() => SalesOrder, so => so.customer)
  salesOrders: SalesOrder[];

  @OneToMany(() => Shipment, shipment => shipment.customer)
  shipments: Shipment[];

    @OneToMany(() => Product, product => product.supplier , {
    cascade: ['insert', 'update', 'remove'],
  })
    products: Product[];
}
