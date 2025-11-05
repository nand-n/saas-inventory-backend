import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRFQItemDto } from './create-rfq-item.dto';
import { RFQStatus } from '../entities/rfq.entity';
import { CreateRFQSupplierDto } from './create-rfq-supplpier.dto';

export class CreateRFQDto {
  @IsOptional()
  @IsString()
  rfqNumber?: string;

  @IsOptional()
  @IsEnum(RFQStatus)
  status?: RFQStatus;

  @IsOptional()
  @IsDateString()
  issuedDate?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRFQItemDto)
  items: CreateRFQItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRFQSupplierDto)
  suppliers: CreateRFQSupplierDto[];
}
