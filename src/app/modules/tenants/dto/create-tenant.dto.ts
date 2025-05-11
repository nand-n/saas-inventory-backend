// create-tenant.dto.ts
import { Type } from 'class-transformer';
import { 
  IsEmail, IsString, IsOptional, IsBoolean, IsUUID, IsNumber, ValidateNested 
} from 'class-validator';

class TenantAdminDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsNumber()
  numberOfBranches: number;

  @IsUUID()
  industryType: string;

  @ValidateNested()
  @Type(() => TenantAdminDto)
  tenantAdmin: TenantAdminDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}