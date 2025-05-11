import { IsUUID, IsNumber, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TransferStatus } from '../entities/stock-transfer.entity';

export class CreateStockTransferDto {
  @IsUUID()
  @IsNotEmpty()
  source_branch_id: string;

  @IsUUID()
  @IsNotEmpty()
  destination_branch_id: string;

  @IsUUID()
  @IsNotEmpty()
  item_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsEnum(TransferStatus)
  @IsOptional()
  status?: TransferStatus;
}

export class UpdateStockTransferDto {
  @IsEnum(TransferStatus)
  @IsOptional()
  status?: TransferStatus;
}