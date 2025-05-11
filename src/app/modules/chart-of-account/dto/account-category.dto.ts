import { IsIn, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAccountCategoryDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsIn(['debit', 'credit'])
  normalBalance: 'debit' | 'credit';
}

export class UpdateAccountCategoryDto extends PartialType(
  CreateAccountCategoryDto,
) {}
