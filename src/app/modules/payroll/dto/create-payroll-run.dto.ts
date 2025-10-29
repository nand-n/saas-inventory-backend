import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PayrollRunStatus } from '../entities/payroll-run.entity';
import { CreatePayrollDto } from './create-payroll.dto';

export class CreatePayrollRunDto {
  @IsString()
  name!: string;

  @IsDateString()
  periodStart!: string;

  @IsDateString()
  periodEnd!: string;

  @IsOptional()
  @IsDateString()
  payDate?: string;

  @IsOptional()
  @IsEnum(PayrollRunStatus)
  status?: PayrollRunStatus;

  @IsOptional()
  @IsNumber()
  totalGrossPay?: number;

  @IsOptional()
  @IsNumber()
  totalNetPay?: number;

  @IsOptional()
  @IsNumber()
  totalDeductions?: number;

  @IsOptional()
  metadata?: Record<string, any>;

  /**
   * Option 1: Provide full payrolls (with adjustments) to create them dynamically inside the run
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePayrollDto)
  payrolls?: CreatePayrollDto[];

  /**
   * Option 2: Provide IDs of existing payrolls to link them to this run
   */
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  payrollIds?: string[];
}
