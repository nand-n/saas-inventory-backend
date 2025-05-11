import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { lowerCaseTransformer } from '@root/src/core/transformers/lower-case.transformer';

export class LoginDto {
  @ApiProperty({ example: 'ramez@gmail.com' })
  @Transform(lowerCaseTransformer)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
