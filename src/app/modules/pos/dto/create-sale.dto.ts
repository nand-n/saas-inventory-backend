import {
  IsString,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSaleLineDto } from './create-sale-line.dto';

export class CreateSaleDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsString()
  cogsAccountId: string;

  @IsString()
  salesRevenueAccountId: string;

  @IsString()
  cashAccountId: string;

  @IsString()
  inventoryAccountId: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateSaleLineDto)
  lines: CreateSaleLineDto[];
}
