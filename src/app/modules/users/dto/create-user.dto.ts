import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user.enum';

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
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];

  @IsOptional()
  @IsString()
  tenantId?:string;

  @IsOptional()
  @IsString()
  branchId?: string;

}
