import { IsIn, IsOptional } from "class-validator";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import { BaseModel } from "@root/src/database/base.model";
import { SubscriptionPlan } from "../../subscription-plan/entities/subscription-plan.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Payment extends BaseModel {
  @IsOptional()
  @ManyToOne(() => User, (user) => user.payments)
  user: User;
  
  @IsOptional()
  @Column({ nullable: true })
  amount: number;

  @IsOptional()
  @ManyToOne(() => SubscriptionPlan, (subscription) => subscription.payment)
  subscriptionPlan: SubscriptionPlan;

  @IsOptional()
  @Column({ nullable: true })
  payment_date: Date;

  @IsOptional()
  @Column({ nullable: true })
  payment_method: string;

  @IsOptional()
  @Column({ default: "PENDING" })
  @IsIn(["PENDING", "COMPLETED" , "FAILED"])
  status: string;
  @IsOptional()
  @Column({ nullable: true })
  tx_ref: string;
}
