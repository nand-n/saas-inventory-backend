import { IsString, IsInt, IsPositive, IsNumber } from 'class-validator';

export class CreateSaleLineDto {
  @IsString()
  itemId: string;

  @IsNumber()
  @IsPositive()
  qty: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  unitCost: number;
}
