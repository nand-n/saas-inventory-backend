import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Branch } from '../../branchs/entities/branch.entity';
import { IndustryType } from '../../industryType/entitities/industryType.entity';
import { Configurations } from '../../configurations/entities/configurations.entity';
import { SubscriptionPlan } from '../../subscription-plan/entities/subscription-plan.entity';

@Entity({ name: 'tenants' })
export class Tenant  extends BaseModel{
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ type:"int" })
  numberOfBranches: number;

  @OneToMany(() => Branch, branch => branch.tenant)
  branches: Branch[];

  @OneToMany(() => User, user => user.tenant)
  users: User[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => IndustryType, industryType => industryType.tenant)
  industryType: IndustryType;

  @OneToOne(() => Configurations, configurations => configurations.tenant)
  configurations: Configurations;

  @ManyToOne(() => SubscriptionPlan, { nullable: true })
  @JoinColumn({ name: 'current_subscription_plan_id' })
  currentSubscriptionPlan: SubscriptionPlan;
}
