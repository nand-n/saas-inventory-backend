import { IsInt, IsBoolean, IsOptional, IsUUID, IsDateString, IsString } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsUUID()
  user_id: string;
  
  @IsUUID()
  tenant_id: string;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;

  @IsBoolean()
  is_active: boolean;

  @IsUUID()
  plan_id: string;

  @IsUUID()
  payment_method_id: string;
}
