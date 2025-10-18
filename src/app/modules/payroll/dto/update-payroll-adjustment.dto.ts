import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollAdjustmentDto } from './create-payroll-adjestime.dto';

export class UpdatePayrollAdjustmentDto extends PartialType(CreatePayrollAdjustmentDto) {}
