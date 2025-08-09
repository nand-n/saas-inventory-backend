import { Entity, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../tenants/entities/tenants.entity';
import { BaseModel } from '@root/src/database/base.model';
import { OrganizationalNode } from '../../configurations/entities/organizational-node.entity';
import { Department } from '../../department/entities/department.entity';

@Entity()
export class Branch  extends BaseModel{
  @Column()
  name: string;

  @Column()
  location: string;

  @Column('float', { nullable: true })
  lat: number;
  @Column('float', { nullable: true })
  lng: number;
  
  @Column({ default: 'warehouse' })
  type: string; // e.g., warehouse, store, outlet

  @ManyToOne(() => Tenant, tenant => tenant.branches)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @OneToMany(() => User, user => user.branch)
  users: User[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => OrganizationalNode, node => node.branch)
  leadershipStructure: OrganizationalNode[];

  @OneToMany(() => Department, department => department.branch)
departments: Department[];
}