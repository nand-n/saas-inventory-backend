import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenants.entity';
import { BaseModel } from '@root/src/database/base.model';

@Entity()
export class InventoryCategory extends BaseModel {
  @Column()
  category_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'uuid' })
  @Index()
  tenant_id: string;
}
