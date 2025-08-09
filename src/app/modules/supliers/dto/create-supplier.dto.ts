import {
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SupplierStatus } from '../entities/suplier.entity';
import { CreateProductDto } from '../../product/dto/create-product.dto';

export class AddressDto {
  @IsString() street: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() country: string;
  @IsString() zipCode: string;
  @IsOptional() @IsString() lat?: string;
  @IsOptional() @IsString() lng?: string;
}

export class CreateSupplierDto {
  @IsString() name: string;
  @IsOptional() @IsString() contactPerson?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsOptional()
  @IsEnum(SupplierStatus)
  status?: SupplierStatus;

  @IsOptional() @IsNumber() performanceRating?: number;
  @IsOptional() @IsNumber() leadTimeDays?: number;
  @IsOptional() @IsString() paymentTerms?: string;
  @IsOptional() @IsString() notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  shipmentIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  newProducts?: CreateProductDto[];
}