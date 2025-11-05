import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRFQSupplierItemDto {
  @IsString()
  rfqItemId: string; 

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  leadTime?: number;

  @IsOptional()
  @IsString()
  revision?: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  committedQty?: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  isSelected?: boolean;

  @IsOptional()
  @IsBoolean()
  isAwarded?: boolean;
}