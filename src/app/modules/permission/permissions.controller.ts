// src/permissions/permissions.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@root/src/core/guards/jwt-auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Roles } from '@root/src/core/decorators/roles.decorator';
import { PermissionsService } from './permissions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Permission Group")
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles('superadmin')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Roles('superadmin')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Roles('superadmin')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Roles('superadmin')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles('superadmin')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}