import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEmail,
  IsUUID,
  ValidateNested,
  IsObject,
  IsArray,
} from 'class-validator';
import { EmploymentStatus, EmploymentType, MaritalStatus } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  nationality?: string;
 
  @IsOptional()
  @IsString()
  education?: string;
   
  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  skills?: string[];
    
  @IsOptional()
  @IsArray()
  languages?: string[];

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  alternatePhone?: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsObject()
  address?: object;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  socialSecurityNumber?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsDateString()
  hireDate: Date;

  @IsOptional()
  @IsDateString()
  terminationDate?: Date;

  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsEnum(EmploymentStatus)
  status?: EmploymentStatus;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsNumber()
  salary: number;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsNumber()
  weeklyHours?: number;

  @IsOptional()
  @IsString()
  bankAccount?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankRoutingNumber?: string;

  @IsOptional()
  @IsObject()
  emergencyContact?: object;

  @IsOptional()
  @IsObject()
  benefits?: object;

  @IsUUID()
  departmentId: string;

  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}

