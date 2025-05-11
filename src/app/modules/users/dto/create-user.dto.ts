import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsString()
  tenantId?:string;

  @IsOptional()
  @IsString()
  branchId?: string;

}
