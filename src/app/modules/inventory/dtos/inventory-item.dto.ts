// inventory-item.dto.ts
import { IsUUID, IsString, IsNotEmpty, IsOptional, IsNumber, IsDecimal } from 'class-validator';

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
  branch_id: string 
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
  reorder_level?: number;
}