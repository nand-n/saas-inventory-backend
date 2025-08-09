import { Entity, Column,  ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Supplier } from '../../supliers/entities/suplier.entity';
import { BaseModel } from '@root/src/database/base.model';
import { OrderItem } from '../../order/entities/order-item.entity';
import { InventoryCategory } from '../../inventory/entities/inventory-category.entity';
import { Branch } from '../../branchs/entities/branch.entity';
import { Customer } from '../../customers/entities/customers.entity';


@Entity('products')
export class Product  extends BaseModel {

  @Column()
  name!: string;

  @Column({ unique: true })
  sku!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_cost: number;

    @Column({ default: 0 })
  reorder_level: number;


  @ManyToOne(() => InventoryCategory)
  @JoinColumn({ name: 'category_id' })
  category: InventoryCategory;

  @Column({ type: 'uuid' })
  @Index()
  category_id: string;

    @Column('text', { nullable: true })
  description!: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  weight!: number;

  @Column('json', { nullable: true })
  dimensions!: {
    length: number;
    width: number;
    height: number;
  };

  @Column({ nullable: true })
  barcode!: string;

  @Column({ default: true })
  isActive!: boolean;

    @Column({ type: 'int', default: 0 })
    quantity: number;
  
    @ManyToOne(() => Branch)
    @JoinColumn({ name: 'branch_id' })
    branch: Branch;
  
    @Column({ type: 'uuid' })
    @Index()
    branch_id: string;

  @ManyToOne(() => Supplier, supplier => supplier.products, {
  onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Customer, supplier => supplier.products, {
  onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;


  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems!: OrderItem[];

}
