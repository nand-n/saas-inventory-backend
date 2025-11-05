import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { RFQ } from './rfq.entity';

@Entity('rfq_items')
export class RFQItem extends BaseModel {
  @ManyToOne(() => RFQ, (rfq) => rfq.items)
  rfq: RFQ;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column('int')
  quantity: number;

  @Column('varchar', { length: 50, nullable: true })
  uom: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimatedUnitPrice: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  lineTotal: number;
}
