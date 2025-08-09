import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsUUID,
  IsBoolean,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DimensionsDto {
  @IsNumber() length: number;
  @IsNumber() width: number;
  @IsNumber() height: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  unit_cost: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorder_level?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsUUID()
  branch_id: string;

  @IsUUID()
  category_id: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  orderItemIds?: string[];
}
