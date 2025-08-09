import { IsString, IsNumber, IsInt } from 'class-validator';

export class CreatePurchaseOrderItemDto {
  @IsString()
  purchaseOrderId: string;

  @IsString()
  productName: string;

  @IsString()
  productId: string;

  @IsNumber()
  unit_cost: number;

  @IsInt()
  quantity: number;

  @IsNumber()
  lineTotal: number;
}
