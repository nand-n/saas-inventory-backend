import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID, Matches } from 'class-validator';

export class CreateCoaDto {
  @IsString()
  name: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  @Matches(/^\d{4}$/, { message: 'Code must be 4 digits' })
  code: string;
}

export class UpdateCoaDto extends PartialType(CreateCoaDto) {}
