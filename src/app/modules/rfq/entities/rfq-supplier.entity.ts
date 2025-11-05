import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { RFQ } from './rfq.entity';
import { Supplier } from '../../supliers/entities/suplier.entity';
import { RFQSupplierItem } from './rfq-supplier-item.entity';

@Entity('rfq_suppliers')
export class RFQSupplier extends BaseModel {
  @ManyToOne(() => RFQ, (rfq) => rfq.suppliers)
  rfq: RFQ;

  @ManyToOne(() => Supplier, (supplier) => supplier.rfqSuppliers)
  supplier: Supplier;

  @Column({ default: false })
  hasResponded: boolean;

  @Column({ type: 'timestamp', nullable: true })
  responseDate: Date;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  totalBidAmount: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  selectedSubtotal: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
  contactName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
  contactEmail: string;


  @OneToMany(() => RFQSupplierItem, (item) => item.rfqSupplier, {
    cascade: true,
  })
  items: RFQSupplierItem[];
}
