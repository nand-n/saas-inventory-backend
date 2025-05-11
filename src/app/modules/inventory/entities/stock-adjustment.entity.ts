import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { BaseModel } from '@root/src/database/base.model';
import { User } from '../../users/entities/user.entity';
import { Branch } from '../../branchs/entities/branch.entity';

export enum AdjustmentReason {
  DAMAGE = 'Damage',
  THEFT = 'Theft',
  EXPIRATION = 'Expiration',
  COUNT_ERROR = 'Count Error'
}

@Entity()
export class StockAdjustment extends BaseModel {
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

  @Column({ type: 'enum', enum: AdjustmentReason })
  reason: AdjustmentReason;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  approved_by: User;

  @Column({ type: 'uuid' })
  approved_by_id: string;
}
