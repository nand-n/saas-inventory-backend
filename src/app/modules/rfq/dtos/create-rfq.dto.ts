import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRFQItemDto } from './create-rfq-item.dto';
import { RFQStatus } from '../entities/rfq.entity';

export class CreateRFQDto {
  @IsOptional()
  @IsString()
  supplierId?: string;

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

  @ValidateNested({ each: true })
  @Type(() => CreateRFQItemDto)
  items: CreateRFQItemDto[];
}
