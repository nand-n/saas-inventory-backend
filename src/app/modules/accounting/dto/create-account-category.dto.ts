import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAccountCategoryDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @IsOptional()
  @IsBoolean()
  readOnly?: boolean;
}
