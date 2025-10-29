import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Payroll } from './payroll.entity';

export enum PayrollRunStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
}

@Entity('payroll_runs')
export class PayrollRun extends BaseModel {
  @Column()
  name!: string; 

  @Column()
  periodStart!: Date;

  @Column()
  periodEnd!: Date;

  @Column({ nullable: true })
  payDate!: Date;

  @Column({
    type: 'enum',
    enum: PayrollRunStatus,
    default: PayrollRunStatus.DRAFT,
  })
  status!: PayrollRunStatus;

  @Column('numeric', { precision: 18, scale: 2, default: 0 })
  totalGrossPay!: number;

  @Column('numeric', { precision: 18, scale: 2, default: 0 })
  totalNetPay!: number;

  @Column('numeric', { precision: 18, scale: 2, default: 0 })
  totalDeductions!: number;

  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @OneToMany(() => Payroll, payroll => payroll.run, { cascade: true })
  payrolls!: Payroll[];
}
