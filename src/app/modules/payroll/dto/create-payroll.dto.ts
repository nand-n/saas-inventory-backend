import {
  IsDateString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
  IsString,
  IsObject,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { PayrollStatus, PayrollType } from '../entities/payroll.entity';
import { Type } from 'class-transformer';
import { CreateJournalDto } from '../../accounting/dto/create-journal.dto';
import { CreatePayrollAdjustmentDto } from './create-payroll-adjestime.dto';

export class CreatePayrollDto {
  @IsDateString() payPeriodStart: Date;
  @IsDateString() payPeriodEnd: Date;
  @IsDateString() payDate: Date;

  @IsNumber() hoursWorked: number;
  @IsOptional() @IsNumber() overtimeHours?: number;

  @IsNumber() grossPay: number;
  @IsOptional() @IsNumber() overtimePay?: number;
  @IsOptional() @IsNumber() bonusPay?: number;
  @IsOptional() @IsNumber() commissionPay?: number;

  @IsOptional() @IsNumber() federalTax?: number;
  @IsOptional() @IsNumber() stateTax?: number;
  @IsOptional() @IsNumber() socialSecurityTax?: number;
  @IsOptional() @IsNumber() medicareTax?: number;
  @IsOptional() @IsNumber() healthInsurance?: number;
  @IsOptional() @IsNumber() retirementContribution?: number;
  @IsOptional() @IsNumber() otherDeductions?: number;

  @IsNumber() netPay: number;

  @IsEnum(PayrollStatus)
  @IsOptional()
  status?: PayrollStatus;

  @IsEnum(PayrollType)
  @IsOptional()
  type?: PayrollType;

  @IsOptional() @IsObject() deductionDetails?: any;
  @IsOptional() @IsString() notes?: string;

  @IsUUID() @IsString() employeeId: string;

  @IsUUID() @IsString() salaryExpenseAccountId: string;

  @IsUUID() @IsString() taxesPayableAccountId: string;

  @IsUUID() @IsString() bankAccountId: string;

  @IsUUID() @IsString() accruedPayrollLiabilityAccountId: string;

  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePayrollAdjustmentDto)
  adjustments?: CreatePayrollAdjustmentDto[];

}