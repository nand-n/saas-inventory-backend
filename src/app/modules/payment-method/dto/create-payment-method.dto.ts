import { IsString, IsOptional, Length, IsBoolean } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @Length(1, 255)
  payment_method: string;

  @IsString()
  @Length(1, 255)
  currency: string;

  @IsString()
  @Length(1, 255)
  currencyCode: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  card_number?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  phone_number?: string;

  @IsBoolean()
  @IsOptional()
  isFree:boolean
}
