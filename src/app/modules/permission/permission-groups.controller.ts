import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@root/src/core/guards/jwt-auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { Roles } from '@root/src/core/decorators/roles.decorator';
import { PermissionGroupsService } from './permission-groups.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Permission Group")
@Controller('permission-groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionGroupsController {
  constructor(private readonly groupsService: PermissionGroupsService) {}

  @Post()
  @Roles('superadmin')
  create(@Body() createGroupDto: CreatePermissionGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @Roles('superadmin')
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @Roles('superadmin')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @Roles('superadmin')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdatePermissionGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @Roles('superadmin')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}