import { IsString, IsNumber, Min, Length, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class Highlight {
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}

class Feature {
  @IsString()
  section: string;

  @IsString()
  name: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  value?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  numericValue?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  booleanValue?: boolean;
}

export class CreatePlanDto {
  @IsString()
  @Length(1, 255)
  plan_name: string;

  @IsString()
  @Length(1, 255)
  slug: string;


  @IsString()
  @Length(1, 255)
  recuring: string;

  @IsString()
  @Length(1, 255)
  description: string;

  @IsNumber()
  @Min(0)
  current_price: number;

  @IsBoolean()
  isFree: boolean;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  days_left: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Highlight)
  highlights: Highlight[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Feature)
  features: Feature[];
}
