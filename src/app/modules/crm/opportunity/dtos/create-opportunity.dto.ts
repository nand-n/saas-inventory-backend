import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { OpportunityStatus } from '../entities/opportunity.entity';

export class CreateOpportunityDto {
  @IsUUID()
  customerId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  estimatedValue?: number;

  @IsEnum(OpportunityStatus)
  status: OpportunityStatus;

  @IsOptional()
  @IsDateString()
  expectedClosingDate?: string;
}
