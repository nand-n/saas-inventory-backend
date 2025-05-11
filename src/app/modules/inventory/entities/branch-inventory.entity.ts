import { Entity, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { BaseModel } from '@root/src/database/base.model';
import { Branch } from '../../branchs/entities/branch.entity';

@Entity()
@Unique(['branch_id', 'item_id'])
export class BranchInventory extends BaseModel {
  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ type: 'uuid' })
  branch_id: string;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: 'item_id' })
  item: InventoryItem;

  @Column({ type: 'uuid' })
  item_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_updated: Date;
}