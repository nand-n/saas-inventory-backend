import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  roleType?: string;
}

// update-node.dto.ts
export class UpdateNodeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsIn(['executive', 'management', 'operational', 'marketing'])
  roleType?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  branchId?: string;
}