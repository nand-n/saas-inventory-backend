import {
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseOrderStatus } from '../entities/purchase-order.entity';

class PurchaseOrderItemDto {
  @IsString()
  productName: string;
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unit_cost: number;
}

export class CreatePurchaseOrderDto {
  @IsString()
  supplierId: string;

  @IsEnum(PurchaseOrderStatus)
  status: PurchaseOrderStatus;

  @IsDateString()
  orderDate: string;

  @IsDateString()
  expectedDeliveryDate: string;

  @IsNumber()
  totalAmount: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];
}
