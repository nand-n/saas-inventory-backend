import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsNumber,
  IsUUID,
  IsBoolean,
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

  @IsUUID()
  @IsOptional()
  customerId?: string;

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

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  shippingCost?: number;

  @IsOptional()
  @IsString()
  containerNumber?: string;

  @IsOptional()
  @IsString()
  vesselName?: string;

  @IsOptional()
  @IsString()
  portOfLoading?: string;

  @IsOptional()
  @IsString()
  portOfDischarge?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomsInfoDto)
  customsInfo?: CustomsInfoDto;

  /** 🚚 Domestic delivery–specific fields */
  @IsOptional()
  @IsString()
  deliveryAgentName?: string;

  @IsOptional()
  @IsString()
  deliveryAgentPhone?: string;

  @IsOptional()
  @IsString()
  vehiclePlateNumber?: string;

  @IsOptional()
  @IsString()
  deliveryProofUrl?: string;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  recipientSignatureUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPartialDelivery?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
