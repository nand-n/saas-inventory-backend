import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { BaseModel } from '@root/src/database/base.model';
import { Branch } from '../../branchs/entities/branch.entity';

export enum TransferStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

@Entity()
export class StockTransfer extends BaseModel {
  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'source_branch_id' })
  source_branch: Branch;

  @Column({ type: 'uuid' })
  source_branch_id: string;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'destination_branch_id' })
  destination_branch: Branch;

  @Column({ type: 'uuid' })
  destination_branch_id: string;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: 'item_id' })
  item: InventoryItem;

  @Column({ type: 'uuid' })
  item_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'enum', enum: TransferStatus, default: TransferStatus.PENDING })
  status: TransferStatus;
}