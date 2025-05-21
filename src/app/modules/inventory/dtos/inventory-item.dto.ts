// inventory-item.dto.ts
import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
export enum PaymentTypeCashOrCredit {
  CASH = 'cash',
  CREDIT = 'credit',
}

export class CreateInventoryItemDto {
  @IsString()
  @IsNotEmpty()
  item_name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;
  @IsNumber()
  @IsNotEmpty()
  unit_cost: number;

  @IsNumber()
  @IsOptional()
  reorder_level?: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsUUID()
  @IsNotEmpty()
  branch_id: string;

  @IsUUID()
  @IsNotEmpty()
  inventory_account_id: string;

  @IsUUID()
  @IsNotEmpty()
  payment_account_id: string;

  @IsEnum(PaymentTypeCashOrCredit)
  @IsOptional()
  payment_type?: PaymentTypeCashOrCredit;

  @IsString()
  @IsOptional()
  supplierId?: string;

  @IsString()
  @IsOptional()
  tenantId?: string;
}

export class UpdateInventoryItemDto {
  @IsString()
  @IsOptional()
  item_name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsOptional()
  unit_price?: number;

  @IsNumber()
  @IsOptional()
  unit_cost?: number;

  @IsNumber()
  @IsOptional()
  reorder_level?: number;
}
