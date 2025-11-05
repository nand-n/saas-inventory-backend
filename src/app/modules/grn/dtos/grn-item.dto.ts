import { IsDateString, IsInt, IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateGRNItemDto {
  @IsOptional()
  @IsString()
  medicineName?: string;

  @IsOptional()
  @IsInt()
  receivedQuantity?: number;

  @IsOptional()
  @IsString()
  unit?: string; // Unit of measure

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
