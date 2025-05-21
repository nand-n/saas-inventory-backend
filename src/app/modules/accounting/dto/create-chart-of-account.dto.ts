import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsIn,
  ValidateIf,
  IsUUID,
} from 'class-validator';
import { CashFlowCategory } from '../entities/chart-of-account.entity';

export class CreateChartOfAccountDto {
  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @ValidateIf((o) => o.parentId !== null)
  @IsUUID()
  parentId?: string | null;

  @IsBoolean()
  @IsOptional()
  isLeaf?: boolean;

  @IsIn([...Object.values(CashFlowCategory), null])
  @IsOptional()
  cashFlowCategory?: CashFlowCategory;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  readOnly?: boolean;
}
