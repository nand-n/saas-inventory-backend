import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Employee } from '../../hr/entities/employee.entity';
import { Payroll } from '../../payroll/entities/payroll.entity';
import { ChartOfAccount } from '../../accounting/entities/chart-of-account.entity';

/**
 * 🧩 Adjustment Direction — whether it adds or deducts from payroll
 */
export enum AdjustmentDirection {
  ADDITION = 'addition',
  DEDUCTION = 'deduction',
}

/**
 * ⚙️ Adjustment Type — defines the context or nature of the change
 */
export enum AdjustmentType {
  BONUS = 'bonus',
  ALLOWANCE = 'allowance',
  OVERTIME = 'overtime',
  COMMISSION = 'commission',
  REIMBURSEMENT = 'reimbursement',
  TAX = 'tax',
  FINE = 'fine',
  LOAN = 'loan',
  ADVANCE = 'advance',
  OTHER = 'other',
}

/**
 * 💼 Payroll Adjustment
 * Combines both additions and deductions for employees in payroll processing
 */
@Entity('payroll_adjustments')
export class PayrollAdjustment extends BaseModel {
  /**
   * 🎯 Nature of adjustment (bonus, loan, overtime, etc.)
   */
  @Column({
    type: 'enum',
    enum: AdjustmentType,
    default: AdjustmentType.OTHER,
  })
  type!: AdjustmentType;

  /**
   * ➕➖ Direction (addition or deduction)
   */
  @Column({
    type: 'enum',
    enum: AdjustmentDirection,
  })
  direction!: AdjustmentDirection;

  /**
   * 💰 Amount of the adjustment
   */
  @Column('decimal', { precision: 15, scale: 2 })
  amount!: number;

  /**
   * 🧾 Description or reason (e.g., “Overtime 5h @ 200/hr”)
   */
  @Column({ nullable: true })
  reason?: string;

  /**
   * 📅 Effective payroll or date
   */
  @Column({ nullable: true })
  effectiveDate?: Date;

  /**
   * 🕒 If recurring (e.g., monthly allowance or deduction)
   */
  @Column({ default: false })
  isRecurring!: boolean;

  /**
   * 🧠 For HR policies (optional link)
   */
  @Column({ nullable: true })
  policyCode?: string;

  /**
   * ✅ Approval workflow
   */
  @Column({ default: 'pending' })
  approvalStatus!: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ nullable: true })
  approvalDate?: Date;

  @Column({ nullable: true })
  processedByPayroll?: boolean;

  /**
   * --- Accounting Fields ---
   * Ensures traceability in journals and ledgers
   */
  @Column({ nullable: true })
  debitAccountId?: string;

  @Column({ nullable: true })
  creditAccountId?: string;

  @ManyToOne(() => ChartOfAccount, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'debitAccountId' })
  debitAccount?: ChartOfAccount;

  @ManyToOne(() => ChartOfAccount, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creditAccountId' })
  creditAccount?: ChartOfAccount;

  /**
   * 👤 Employee association
   */
  @ManyToOne(() => Employee, (employee) => employee.adjustments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee!: Employee;

  /**
   * 💼 Payroll association
   */
  @ManyToOne(() => Payroll, (payroll) => payroll.adjustments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'payrollId' })
  payroll?: Payroll;

  /**
   * 📦 Optional metadata (JSON for flexibility)
   */
  @Column('json', { nullable: true })
  metadata?: any;
}
