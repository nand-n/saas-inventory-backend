import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateRFQSupplierItemDto } from "./create-rfq-supplier-item";

export class CreateRFQSupplierDto {
  @IsString()
  supplierId: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsBoolean()
  hasResponded?: boolean;

  @IsOptional()
  @IsDateString()
  responseDate?: string;

  @IsOptional()
  @IsNumber()
  totalBidAmount?: number;

  @IsOptional()
  @IsNumber()
  selectedSubtotal?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRFQSupplierItemDto)
  items: CreateRFQSupplierItemDto[];
}