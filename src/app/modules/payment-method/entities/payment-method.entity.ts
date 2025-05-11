import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Plan } from '../../plan/entities/plan.entity';

@Entity()
export class PaymentMethod extends BaseModel {

  @Column({ type: 'varchar', length: 255 })
  payment_method: string;

  
  @Column({ type: 'varchar', length: 255 })
  currency: string;

  @Column({ type: 'varchar', length: 255 })
  currencyCode: string;

  @Column({ type: 'varchar', length: 255 , nullable:true })
  card_number: string;

  @Column({ type: 'bool',nullable:true })
  isFree: boolean;

  @Column({ type: 'varchar', length: 255 ,nullable:true })
  phone_number: string;

  @ManyToOne(() => Plan, plan => plan.paymentMethods, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

}
