import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInventoryCategoryDto {
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  tenant_id: string;
}

export class UpdateInventoryCategoryDto {
  @IsString()
  @IsOptional()
  category_name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}