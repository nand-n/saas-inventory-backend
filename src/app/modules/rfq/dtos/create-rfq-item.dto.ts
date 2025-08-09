import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRFQItemDto {
  @IsString()
  productName: string;

  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  expectedUnitCost?: number;

  @IsOptional()
  @IsNumber()
  lineTotal?: number;
}
