import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Employee } from '../../hr/entities/employee.entity';
import { BaseModel } from '@root/src/database/base.model';
import { PayrollAdjustment } from './payroll-adjestment.entity';

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

  @Column('decimal', { precision: 5, scale: 2 })
  hoursWorked!: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  overtimeHours!: number;

  @Column('decimal', { precision: 15, scale: 2 })
  grossPay!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  overtimePay!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  bonusPay!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  commissionPay!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  federalTax!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  stateTax!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  socialSecurityTax!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  medicareTax!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  healthInsurance!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  retirementContribution!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  otherDeductions!: number;

  @Column('decimal', { precision: 15, scale: 2 })
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

  @OneToMany(() => PayrollAdjustment, deduction => deduction.payroll)
adjustments!: PayrollAdjustment[];


}
