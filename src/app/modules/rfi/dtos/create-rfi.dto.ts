import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { RfiQuestionDto } from './rfi-question.dto';

export class CreateRfiDto {
  @ApiProperty({ example: 'RFI-2025-001' })
  @IsString()
  referenceNumber: string;

  @ApiProperty({ example: 'Request for Information - ERP Implementation Partners' })
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  introduction?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  background?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scopeOfInformation?: string;

  @ApiProperty({ type: [RfiQuestionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RfiQuestionDto)
  questions?: RfiQuestionDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  responseFormat?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  submissionDeadline?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nextSteps?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  confidentialityNotice?: string;

  @ApiProperty({
    enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
    required: false,
    default: 'DRAFT',
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'CLOSED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED';

  @ApiProperty({ type: [Object], required: false })
  @IsOptional()
  attachments?: { name: string; url: string }[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}
