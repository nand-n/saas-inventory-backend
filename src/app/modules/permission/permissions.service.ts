// src/permissions/permissions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    const permission = this.permissionRepo.create(createPermissionDto);
    return this.permissionRepo.save(permission);
  }

  findAll() {
    return this.permissionRepo.find();
  }

  findOne(id: string) {
    return this.permissionRepo.findOneBy({ id });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    await this.permissionRepo.update(id, updatePermissionDto);
    return this.findOne(id);
  }

async findAllByIds(ids: string[]) {
    return this.permissionRepo.findBy({ id: In([1, 2, 3]) })
}

remove(id: string) {
    return this.permissionRepo.delete(id);
}
}