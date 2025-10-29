import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePlanningDto {
  @ApiProperty({ example: 'Tablet Import Plan Oct 2025' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  forecastMonthlyDemand: number;

  @ApiProperty({ example: 6 })
  @IsOptional()
  @IsNumber()
  forecastHorizonMonths?: number;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  currentOnHand: number;

  @ApiProperty({ example: 8 })
  @IsOptional()
  @IsNumber()
  leadTimeWeeks?: number;

  @ApiProperty({ example: 98 })
  @IsOptional()
  @IsNumber()
  desiredServiceLevel?: number;

  @ApiProperty({ example: 36 })
  @IsOptional()
  @IsNumber()
  shelfLifeMonths?: number;

  @ApiProperty({ example: 18 })
  @IsOptional()
  @IsNumber()
  minRemainingShelfLifeMonths?: number;

  @ApiProperty({ example: 1000 })
  @IsOptional()
  @IsNumber()
  moq?: number;

  @ApiProperty({ example: 50 })
  @IsOptional()
  @IsNumber()
  packagingMultiple?: number;

  @ApiProperty({ example: 1.5 })
  @IsOptional()
  @IsNumber()
  safetyFactor?: number;
}
