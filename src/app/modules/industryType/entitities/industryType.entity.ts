import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenants.entity';

@Entity()
export class IndustryType extends BaseModel {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => Tenant, tenant => tenant.industryType)
    tenant: Tenant;
}