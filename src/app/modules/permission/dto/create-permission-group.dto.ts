// src/permissions/dto/create-permission-group.dto.ts
import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreatePermissionGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}

