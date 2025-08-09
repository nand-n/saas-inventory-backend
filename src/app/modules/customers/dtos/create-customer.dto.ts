import { IsString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { CustomerStatus } from '../entities/customers.entity';
import { Type } from 'class-transformer';
import { CreateProductDto } from '../../product/dto/create-product.dto';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @IsEnum(CustomerStatus)
  @IsOptional()
  status?: CustomerStatus;


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
