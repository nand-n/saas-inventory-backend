import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ConfigurationsService } from './configurations.service';
import { CreateConfigurationsDto } from './dtos/create-configurations.dtos';
import { UpdateConfigurationsDto } from './dtos/update-configurations.dto';
import { AuthGuard } from '@root/src/core/guards/auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';
import { Roles } from '@root/src/core/decorators/roles.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationalNode } from './entities/organizational-node.entity';
import { CreateNodeDto } from './dtos/create-node-dto';
  
  @ApiTags('Configurations')
  @Controller('configurations')
  // @UseGuards(
  //   AuthGuard,
  //   RolesGuard
  // )
  export class ConfigurationsController {
    constructor(private readonly configurationsService: ConfigurationsService) {}
  
    @Post()
  // @Roles('superadmin', 'tenant_admin')
    create(@Body() createConfigurationsDto: CreateConfigurationsDto) {
      return this.configurationsService.create(createConfigurationsDto);
    }

    @Post('/org-structure/')
    @ApiOperation({ summary: 'Create organizational Structure' })
    // @Roles('superadmin', 'tenant_admin')
    createNode(
      @Body() createNodeDto: CreateNodeDto,
    ) {
      return this.configurationsService.createOrganizationNode(createNodeDto);
    }

    
    @Get('/org-structure/:tenantId/tree')
    @ApiOperation({ summary: 'Get single organizational Structure' })
    // @Roles('superadmin', 'tenant_admin', 'branch_manager')
    getOrgStrucure(
      @Param('tenantId') tenantId: string
    ) {
      return this.configurationsService.getOrgTreeByTenantId(tenantId);
    }
    @Get('/org-structure/childof/:nodeId')
    @ApiOperation({ summary: 'Get single organizational node' })
    // @Roles('superadmin', 'tenant_admin', 'branch_manager')
    getNode(
      @Request() req: any,  
      @Param('nodeId') nodeId: string
    ) {
      const tenantId = req.user.tenantId;
      if (!tenantId) {
        throw new UnauthorizedException('Tenant ID not found in request');
      }
      return this.configurationsService.getOrganizationStructure( tenantId , nodeId  , 1);
    }
  
    @Patch('/org/nodes/:nodeId')
    @ApiOperation({ summary: 'Update organizational node' })
    // @Roles('superadmin', 'tenant_admin')
    updateNode(
      @Param('tenantId') tenantId: string,
      @Param('nodeId') nodeId: string,
      @Body() updateData: Partial<OrganizationalNode>
    ) {
      return this.configurationsService.updateOrganizationNode(nodeId, tenantId, updateData);
    }
  
    @Delete(':tenantId/org/nodes/:nodeId')
    @ApiOperation({ summary: 'Delete organizational node' })
    // @Roles('superadmin', 'tenant_admin')
    deleteNode(
      @Param('tenantId') tenantId: string,
      @Param('nodeId') nodeId: string
    ) {
      return this.configurationsService.removeOrganizationNode(nodeId, tenantId);
    }
  
    @Get(':tenantId')
    // @Roles('superadmin' , 'tenant_admin')
    findOne(@Param('tenantId') tenantId: string) {
      return this.configurationsService.findOne(tenantId);
    }
  
    @Patch(':tenantId')
    // @Roles('superadmin', 'tenant_admin')
    update(
      @Param('tenantId') tenantId: string,
      @Body() updateConfigurationsDto: UpdateConfigurationsDto,
    ) {
      return this.configurationsService.update(tenantId, updateConfigurationsDto);
    }
  
    @Delete(':tenantId')
    @Roles('superadmin', 'tenant_admin')
    remove(@Param('tenantId') tenantId: string) {
      return this.configurationsService.remove(tenantId);
    }
  }