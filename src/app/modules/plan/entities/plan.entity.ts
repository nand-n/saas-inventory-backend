import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';
import { PaymentMethod } from '../../payment-method/entities/payment-method.entity';

@Entity()
export class Plan extends BaseModel {

  @Column({ type: 'varchar', length: 255 })
  plan_name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar' })
  currency: string;
  @Column({ type: 'float' })
  current_price: number;

  @Column({type:'bool'})
  isFree:boolean

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'int' })
  days_left: number;

  @Column({ type: 'varchar', length: 255 })
  slug: string;
  
  @Column({ type: 'varchar', length: 255 })
  recuring: string;

  @Column({ type: 'jsonb' })
  highlights: { description: string; disabled?: boolean }[];

  @Column({ type: 'jsonb' })
  features: { section: string; name: string; value: string | number | boolean }[];

  @OneToMany(() => PaymentMethod, paymentMethod => paymentMethod.plan)
  paymentMethods: PaymentMethod[];
}
