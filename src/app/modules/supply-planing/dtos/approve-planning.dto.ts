import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PlanningStatus } from '../entities/planning.entity';

export class ApprovePlanningDto {
  @IsEnum(PlanningStatus)
  status: PlanningStatus;

  @IsString()
  approvedBy: string;

  @IsOptional()
  @IsString()
  approvalRemarks?: string;
}
