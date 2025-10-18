import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { CustomerType } from '../entities/customer.entity';

export class CreateCRMCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsEnum(CustomerType)
  type: CustomerType;
}
