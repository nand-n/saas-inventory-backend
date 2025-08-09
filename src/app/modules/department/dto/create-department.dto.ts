// src/departments/dto/create-department.dto.ts

import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDecimal,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }) 
  budget?: number;

  @IsOptional()
  @IsUUID()
  parentDepartmentId?: string;

  @IsOptional()
  @IsUUID()
  managerId?: string;

  @IsUUID()
  branchId: string;
}
