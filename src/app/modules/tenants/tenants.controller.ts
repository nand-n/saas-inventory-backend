import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '@root/src/core/guards/jwt-auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';
import { Roles } from '@root/src/core/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@root/src/core/guards/auth.guard';

@ApiTags('Tenants')
@Controller('tenants')
// @UseGuards(
//   AuthGuard,
//   RolesGuard
// )
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles('superadmin' , "tenant_admin")
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  // @Roles('superadmin' , 'tenant_admin' ) 
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  // @Roles('superadmin', 'tenant_admin')
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @Roles('superadmin', 'tenant_admin')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @Roles('superadmin')
  deactivate(@Param('id') id: string) {
    return this.tenantsService.deactivate(id);
  }
}