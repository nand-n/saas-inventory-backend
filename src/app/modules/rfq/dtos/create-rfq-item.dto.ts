import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRFQItemDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  uom?: string;

  @IsOptional()
  @IsNumber()
  estimatedUnitPrice?: number;

  @IsOptional()
  @IsNumber()
  lineTotal?: number;

  @IsOptional()
  @IsString()
  itemNo?: string;
}
