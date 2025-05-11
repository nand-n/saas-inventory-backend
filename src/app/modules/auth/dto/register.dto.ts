import { IsString , IsArray } from "class-validator";

export class RegisterDto {
    @IsString()
    email: string;

    @IsString()
    password: string;
    
    @IsArray()
    @IsString({ each: true })
    @IsString()
    roles: string[];

    @IsString()
    tenantId: string;

    @IsString()
    branchId: string;
  }