import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderItemDto {
  @IsUUID() orderId: string;
  @IsUUID() productId: string;
  @IsNumber() quantity: number;
  @IsNumber() unitPrice: number;
  @IsOptional() @IsNumber() discountPercent?: number;
  @IsOptional() @IsNumber() discountAmount?: number;
  @IsNumber() totalPrice: number;
  @IsNumber() finalPrice: number;
  @IsOptional() @IsString() notes?: string;
}