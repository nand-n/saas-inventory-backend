import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsArray, IsInt } from 'class-validator';

export class RfiQuestionDto {
  @ApiProperty({ example: 'What certifications do you hold?' })
  @IsString()
  question: string;

  @ApiProperty({ enum: ['TEXT', 'NUMBER', 'MULTIPLE_CHOICE'], required: false })
  @IsOptional()
  @IsEnum(['TEXT', 'NUMBER', 'MULTIPLE_CHOICE'])
  responseType?: 'TEXT' | 'NUMBER' | 'MULTIPLE_CHOICE';

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  options?: string[];

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  order?: number;
}
