import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType, DocumentStatus } from '../entities/customs-document.entity';
import { PartialType } from '@nestjs/mapped-types';

export class AttachmentDto {
  @IsString()
  fileName: string;

  @IsString()
  fileUrl: string;

  @IsString()
  fileType: string;

  @IsNumber()
  fileSize: number;
}

export class HsCodeInfoDto {
  @IsString()
  hsCode: string;

  @IsString()
  description: string;

  @IsNumber()
  dutyRate: number;

  @IsNumber()
  taxRate: number;
}

export class CreateCustomsDocumentDto {
  @IsString()
  documentNumber: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsDateString()
  issuedDate: Date;

  @IsOptional()
  @IsDateString()
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @IsOptional()
  @IsString()
  issuingCountry?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsNumber()
  declaredValue?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HsCodeInfoDto)
  hsCodeInfo?: HsCodeInfoDto[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsDateString()
  approvedDate?: Date;

  @IsString()
  shipmentId: string;
}
