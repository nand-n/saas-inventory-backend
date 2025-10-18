import { IsEnum, IsString, IsUUID } from 'class-validator';
import { InteractionType } from '../entities/interaction.entity';

export class CreateInteractionDto {
  @IsUUID()
  customerId: string;

  @IsEnum(InteractionType)
  type: InteractionType;

  @IsString()
  description: string;
}
