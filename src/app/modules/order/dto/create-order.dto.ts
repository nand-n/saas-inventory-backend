import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, OrderType } from '../entities/order.entity';

export class AddressDto {
  @IsString() street: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() country: string;
  @IsString() zipCode: string;
}

export class CreateOrderDto {
  @IsString() orderNumber: string;
  @IsEnum(OrderType) @IsOptional() type?: OrderType;
  @IsEnum(OrderStatus) @IsOptional() status?: OrderStatus;
  @IsNumber() subtotal: number;
  @IsNumber() @IsOptional() taxAmount?: number;
  @IsNumber() @IsOptional() shippingAmount?: number;
  @IsNumber() @IsOptional() discountAmount?: number;
  @IsNumber() totalAmount: number;
  @IsOptional() @IsString() paymentMethod?: string;
  @IsOptional() @IsString() paymentStatus?: string;
  @IsOptional() @IsString() shippingMethod?: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress?: AddressDto;
  @IsOptional() @IsDateString() expectedDeliveryDate?: Date;
  @IsOptional() @IsString() notes?: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  orderItemIds?: string[];
}
