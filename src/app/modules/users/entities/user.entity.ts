import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenants.entity';
import { BaseModel } from '@root/src/database/base.model';
import { Branch } from '../../branchs/entities/branch.entity';
import { PermissionGroup } from '../../permission/entities/permission-group.entity';
import { SubscriptionPlan } from '../../subscription-plan/entities/subscription-plan.entity';
import { IsOptional } from 'class-validator';
import { Payment } from '../../payment/entities/payment.entity';

@Entity()
export class User extends BaseModel {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column('simple-array', { default: ['user'] })
  roles: string[];

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => Branch, { nullable: true })
  branch: Branch;

  @Column({ nullable: true })
  branchId: string;

  @ManyToMany(() => PermissionGroup, group => group.users)
  @JoinTable()
  permissionGroups: PermissionGroup[];

  @ManyToOne(() => SubscriptionPlan, (subscription) => subscription.user, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subscription_plan_id' })
  subscriptionPlan?: SubscriptionPlan;
  
  
  @IsOptional()
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
