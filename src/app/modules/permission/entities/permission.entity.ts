import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { PermissionGroup } from './permission-group.entity';

@Entity()
export class Permission extends BaseModel {
  @Column({ unique: true })
  name: string; 

  @Column({ nullable: true })
  description: string;
  @ManyToMany(() => PermissionGroup, group => group.permissions)
  groups: PermissionGroup[];
}