// src/permissions/permission-groups.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionGroup } from './entities/permission-group.entity';
import { PermissionsService } from './permissions.service';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PermissionGroupsService {
  constructor(
    @InjectRepository(PermissionGroup)
    private readonly groupRepo: Repository<PermissionGroup>,
    private readonly permissionsService: PermissionsService,
    private readonly usersService: UsersService,

  ) {}

  async create(createGroupDto: CreatePermissionGroupDto) {
    const permissions = await this.permissionsService.findAllByIds(
      createGroupDto.permissionIds,
    );
    
    const group = this.groupRepo.create({
      ...createGroupDto,
      permissions,
    });
    
    return this.groupRepo.save(group);
  }

  findAll() {
    return this.groupRepo.find({ relations: ['permissions'] });
  }

  findOne(id: string) {
    return this.groupRepo.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    });
  }

  async update(id: string, updateGroupDto: UpdatePermissionGroupDto) {
    const group = await this.findOne(id);
    if (!group) throw new NotFoundException('Group not found');

    if (updateGroupDto.permissionIds) {
      group.permissions = await this.permissionsService.findAllByIds(
        updateGroupDto.permissionIds,
      );
    }

    Object.assign(group, updateGroupDto);
    return this.groupRepo.save(group);
  }

  remove(id: string) {
    return this.groupRepo.delete(id);
  }


  async assignPermissionGroup(userId: string, groupId: string) {
    const user = await this.usersService.findOneWithPermission(userId);
    const group = await this.groupRepo.findOneBy({ id: groupId });

    if (!user || !group) {
      throw new NotFoundException('User or Group not found');
    }

    user.permissionGroups = [...(user.permissionGroups || []), group];
    return this.usersService.update(userId,user);
  }
}