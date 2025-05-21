import { PartialType } from '@nestjs/mapped-types';
import { CashFlowCategory } from '../entities/chart-of-account.entity';
import { CreateChartOfAccountDto } from './create-chart-of-account.dto';

// src/accounting/dto/update-chart-of-account.dto.ts
export class UpdateChartOfAccountDto extends PartialType(
  CreateChartOfAccountDto,
) {}
