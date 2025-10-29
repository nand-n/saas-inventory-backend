import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Employee } from '../../hr/entities/employee.entity';
import { BaseModel } from '@root/src/database/base.model';
import { PayrollAdjustment } from './payroll-adjestment.entity';
import { PayrollRun } from './payroll-run.entity';

export enum PayrollStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export enum PayrollType {
  REGULAR = 'regular',
  OVERTIME = 'overtime',
  BONUS = 'bonus',
  COMMISSION = 'commission',
  SPECIAL = 'special'
}

@Entity('payrolls')
export class Payroll extends BaseModel {
  @Column()
  payPeriodStart!: Date;

  @Column()
  payPeriodEnd!: Date;

  @Column()
  payDate!: Date;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  hoursWorked!: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  overtimeHours!: number;

  @Column('numeric', { precision: 18, scale: 2, default: 0 })
  grossPay!: number;

  @Column('numeric', { precision: 18, scale: 2, default: 0 })
  netPay!: number;

  @Column({nullable:true})
  accruedPayrollLiabilityAccountId!: string;
  
  @Column({nullable:true})
  bankAccountId: string


  @Column({nullable:true})
  salaryExpenseAccountId: string

  @Column({nullable:true})
  taxesPayableAccountId: string

  @Column({
    type: 'enum',
    enum: PayrollStatus,
    default: PayrollStatus.DRAFT
  })
  status!: PayrollStatus;

  @Column({
    type: 'enum',
    enum: PayrollType,
    default: PayrollType.REGULAR
  })
  type!: PayrollType;

  @Column('json', { nullable: true })
  deductionDetails: any;

  @Column('json', { nullable: true })
  notes!: string;

  @ManyToOne(() => Employee, employee => employee.payrolls)
  employee!: Employee;

  @OneToMany(() => PayrollAdjustment, adjustments => adjustments.payroll)
  adjustments!: PayrollAdjustment[];

  @ManyToOne(() => PayrollRun, run => run.payrolls, { nullable: true })
@JoinColumn({ name: 'payrollRunId' })
run?: PayrollRun;

@Column({ nullable: true })
payrollRunId?: string;

}
