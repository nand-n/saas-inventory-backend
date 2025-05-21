import {
  IsUUID,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { AdjustmentReason } from '../entities/stock-adjustment.entity';

export class CreateStockAdjustmentDto {
  @IsUUID()
  @IsNotEmpty()
  branch_id: string;

  @IsUUID()
  @IsNotEmpty()
  item_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsEnum(AdjustmentReason)
  @IsNotEmpty()
  reason: AdjustmentReason;

  @IsUUID()
  @IsNotEmpty()
  approved_by_id: string;
}

export class UpdateStockAdjustmentDto {
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsEnum(AdjustmentReason)
  @IsOptional()
  reason?: AdjustmentReason;
}
