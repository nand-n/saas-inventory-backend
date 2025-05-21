// src/accounting/dto/create-journal.dto.ts
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class JournalLineDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsNumber()
  debit: number;

  @IsNumber()
  credit: number;
}

export class CreateJournalDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsDateString()
  date: Date;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalLineDto)
  lines: JournalLineDto[];
}
