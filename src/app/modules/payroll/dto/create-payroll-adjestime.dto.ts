import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { AdjustmentDirection, AdjustmentType } from '../entities/payroll-adjestment.entity';


export class CreatePayrollAdjustmentDto {
  @IsUUID()
  employeeId: string;

  @IsOptional()
  @IsUUID()
  payrollId?: string;

  @IsEnum(AdjustmentType, { message: 'Invalid adjustment type' })
  type: AdjustmentType;

  @IsEnum(AdjustmentDirection, { message: 'Invalid adjustment direction' })
  direction: AdjustmentDirection;

  @IsNumber({}, { message: 'Amount must be a valid number' })
  amount: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @IsOptional()
  @IsString()
  policyCode?: string;

  // ✅ Accounting Fields
  @IsUUID()
  debitAccountId: string; // e.g., Payroll Expense or Liability

  @IsUUID()
  creditAccountId: string; // e.g., Employee Payable or Bank

  // Optional metadata or tags
  @IsOptional()
  metadata?: Record<string, any>;
}
