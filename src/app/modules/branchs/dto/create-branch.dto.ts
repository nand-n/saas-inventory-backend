import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location?: string;
  
  @IsNumber()
  @IsNotEmpty()
  lat?: number;
  
  @IsNumber()
  @IsNotEmpty()
  lng?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}