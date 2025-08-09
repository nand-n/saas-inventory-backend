import { IsString, IsEnum, IsDateString, IsDecimal, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { SalesOrderStatus } from '../entities/sales-order.entity';

class CreateSalesOrderItemDto {
  @IsString()
  productName: string;

  @IsString()
  productId: string;

  @IsDecimal()
  unit_price: number;

  @IsNumber()
  quantity: number;

  @IsDecimal()
  lineTotal: number;
}

export class CreateSalesOrderDto {
  @IsString()
  customerId: string;

  @IsEnum(SalesOrderStatus)
  status: SalesOrderStatus;

  @IsDateString()
  orderDate: Date;

  @IsDecimal()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesOrderItemDto)
  items: CreateSalesOrderItemDto[];
}
