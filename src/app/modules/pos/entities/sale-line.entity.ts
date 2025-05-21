import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sale } from './sale.entity';
import { BaseModel } from '@root/src/database/base.model';

@Entity()
export class SaleLine extends BaseModel {
  @Column()
  itemId: string;

  @Column('int')
  qty: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitCost: number;

  @ManyToOne(() => Sale, (sale) => sale.lines)
  @JoinColumn({ name: 'saleId' })
  sale: Sale;

  @Column()
  saleId: string;
}
