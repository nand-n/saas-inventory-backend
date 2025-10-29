import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { GoodsReceipt } from './grn.entity';

@Entity('goods_receipt_items')
export class GRNItem extends BaseModel {
  @ManyToOne(() => GoodsReceipt, (grn) => grn.items, { onDelete: 'CASCADE' })
  grn: GoodsReceipt;

  @Column()
  medicineName: string;

  @Column('int')
  receivedQuantity: number;

  @Column({ nullable: true })
  batchNumber?: string;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;
}
