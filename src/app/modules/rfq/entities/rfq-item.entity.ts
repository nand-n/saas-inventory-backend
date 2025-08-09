import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { RFQ } from './rfq.entity';

@Entity('rfq_items')
export class RFQItem extends BaseModel {

  @ManyToOne(() => RFQ, rfq => rfq.items)
  rfq: RFQ;

  @Column()
  productName: string;

  @Column()
  productId: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  expectedUnitCost: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  lineTotal: number;
}
