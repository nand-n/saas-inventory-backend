import { Entity, Column, ManyToOne, Index, Unique, JoinColumn } from 'typeorm';
import { InventoryCategory } from './inventory-category.entity';
import { BaseModel } from '@root/src/database/base.model';
import { Branch } from '../../branchs/entities/branch.entity';

@Entity()
@Unique(['sku'])
export class InventoryItem extends BaseModel {
  @Column()
  item_name: string;

  @Column()
  @Index()
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ default: 0 })
  reorder_level: number;

  @ManyToOne(() => InventoryCategory)
  @JoinColumn({ name: 'category_id' })
  category: InventoryCategory;

  @Column({ type: 'uuid' })
  @Index()
  category_id: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ type: 'uuid' })
  @Index()
  branch_id: string;
}