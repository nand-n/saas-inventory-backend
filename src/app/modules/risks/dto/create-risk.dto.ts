import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { RiskSeverity, RiskStatus } from '../entities/risks.entity';

export class CreateRiskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(RiskSeverity)
  severity?: RiskSeverity;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  likelihood?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  impact?: number;

  @IsOptional()
  @IsNumber()
  riskScore?: number | null;

  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;

  @IsOptional()
  @IsUUID()
  branchId?: string | null;

  @IsOptional()
  @IsUUID()
  shipmentId?: string | null;

  @IsOptional()
  @IsString()
  mitigationPlan?: string | null;

  @IsOptional()
  resolvedAt?: Date | null;
}
