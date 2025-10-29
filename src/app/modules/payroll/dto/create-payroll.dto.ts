import {
  IsDateString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
  IsString,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { PayrollStatus, PayrollType } from '../entities/payroll.entity';
import { Type } from 'class-transformer';
import { CreatePayrollAdjustmentDto } from './create-payroll-adjestime.dto';

export class CreatePayrollDto {
  @IsDateString() payPeriodStart: Date;
  @IsDateString() payPeriodEnd: Date;
  @IsDateString() payDate: Date;

  @IsNumber() hoursWorked: number;
  @IsOptional() @IsNumber() overtimeHours?: number;

  @IsNumber() grossPay: number;

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