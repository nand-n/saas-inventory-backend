import { IsString } from 'class-validator';

export class AssignPermissionGroupDto {
  @IsString()
  groupId: string;
}