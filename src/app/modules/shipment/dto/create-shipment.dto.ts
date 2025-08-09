import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsArray,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShipmentType, ShipmentStatus } from '../entities/shipment.entity';

export class AddressDto {
  @IsString() street: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() country: string;
  @IsString() zipCode: string;
}

export class CustomsInfoDto {
  @IsString() declarationNumber: string;
  @IsNumber() dutyAmount: number;
  @IsNumber() taxAmount: number;
  @IsDateString() clearanceDate: Date;
}

export class CreateShipmentDto {
  @IsString()
  trackingNumber: string;

  @IsEnum(ShipmentType)
  @IsOptional()
  type?: ShipmentType;

  @IsEnum(ShipmentStatus)
  @IsOptional()
  status?: ShipmentStatus;

  @IsUUID()
  @IsOptional()
  orderId?: string;

  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @IsString()
  carrier: string;

  @ValidateNested()
  @Type(() => AddressDto)
  originAddress: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  destinationAddress: AddressDto;

  @IsOptional()
  @IsDateString()
  shippedDate?: Date;

  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: Date;

  @IsOptional()
  @IsDateString()
  actualDeliveryDate?: Date;

  @IsOptional() @IsNumber() weight?: number;
  @IsOptional() @IsNumber() shippingCost?: number;
  @IsOptional() @IsString() containerNumber?: string;
  @IsOptional() @IsString() vesselName?: string;
  @IsOptional() @IsString() portOfLoading?: string;
  @IsOptional() @IsString() portOfDischarge?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomsInfoDto)
  customsInfo?: CustomsInfoDto;

  @IsOptional() @IsString() notes?: string;
}