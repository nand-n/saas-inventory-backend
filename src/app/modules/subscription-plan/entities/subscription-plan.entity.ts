import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Plan } from '../../plan/entities/plan.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { PaymentMethod } from '../../payment-method/entities/payment-method.entity';
import { IsOptional } from 'class-validator';
import { Payment } from '../../payment/entities/payment.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class SubscriptionPlan extends BaseModel {
  
  @Column({ type: 'uuid'  , nullable: true })
  tenant_admin_user_id?: string;

  @Column({ type: 'uuid' })
  tenant_id: string;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'uuid' })
  plan_id: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ type: 'uuid' })
  invoice_id: string;

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ type: 'uuid', nullable: true })
  payment_method?: string;

  @ManyToOne(() => PaymentMethod, { nullable: true })
  @JoinColumn({ name: 'payment_method' })
  paymentMethod?: PaymentMethod;
  @Column({ type: 'bool', default:false })
  isPayed:boolean

  @ManyToOne(() => User, (user) => user.subscriptionPlan)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @IsOptional()
  @ManyToOne(() => Payment, payment => payment.subscriptionPlan,  { nullable: true })
  payment: Payment;
}
