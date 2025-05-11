import { IsUUID, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBranchInventoryDto {
  @IsUUID()
  @IsNotEmpty()
  branch_id: string;

  @IsUUID()
  @IsNotEmpty()
  item_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class UpdateBranchInventoryDto {
  @IsNumber()
  @IsOptional()
  quantity?: number;
}