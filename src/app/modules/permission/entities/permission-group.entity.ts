// permission-group.entity.ts
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Permission } from './permission.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class PermissionGroup extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Permission, permission => permission.groups)
  @JoinTable()
  permissions: Permission[];
  @ManyToMany(() => User, user => user.permissionGroups)
  users: User[];
}