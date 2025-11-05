import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsIn,
} from 'class-validator';

class CreateGRNItemDto {
  @IsString()
  @IsNotEmpty()
  medicineName: string;

  @IsInt()
  receivedQuantity: number;

  @IsOptional()
  @IsString()
  unit?: string; // Unit of measure, e.g., pcs, box

  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: Date;

  @IsOptional()
  @IsIn(['PASSED', 'FAILED', 'PENDING'])
  qcStatus?: 'PASSED' | 'FAILED' | 'PENDING';

  @IsOptional()
  @IsString()
  qcRemarks?: string;

  @IsOptional()
  @IsInt()
  pendingQuantity?: number; // For partial receipts
}

export class CreateGoodsReceiptDto {
  @IsString()
  @IsNotEmpty()
  grnNumber: string;

  @IsNotEmpty()
  @IsString()
  purchaseOrderId: string;

  @IsDateString()
  receivedDate: Date;

  @IsOptional()
  @IsString()
  receivedBy?: string;

  @IsOptional()
  @IsString()
  warehouse?: string; // Storage location

  @IsOptional()
  @IsString()
  carrier?: string; // Shipment carrier

  @IsOptional()
  @IsString()
  trackingNumber?: string; // Shipment tracking

  @IsOptional()
  @IsDateString()
  deliveryDate?: Date; // Shipment delivery date

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGRNItemDto)
  items: CreateGRNItemDto[];
}
