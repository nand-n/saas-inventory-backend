import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    UseGuards,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import { BranchesService } from './branches.service';
  import { CreateBranchDto } from './dto/create-branch.dto';
  import { UpdateBranchDto } from './dto/update-branch.dto';

  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { Branch } from './entities/branch.entity';

import { Roles } from '@root/src/core/decorators/roles.decorator';
import { AuthGuard } from '@root/src/core/guards/auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';
  
  @ApiTags('Branches')
  @ApiBearerAuth()
  @Controller('branches/:tenantId/')
  // @UseGuards(AuthGuard, RolesGuard)
  export class BranchesController {
    constructor(private readonly branchesService: BranchesService) {}
  
    @Post()
    // @Roles('tenant_admin', 'superadmin')
    @ApiOperation({ summary: 'Create a new branch for a tenant' })
    @ApiResponse({ status: 201, description: 'Branch created successfully', type: Branch })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 409, description: 'Branch name already exists' })
    @ApiParam({ name: 'tenantId', type: String, description: 'Tenant ID' })
    @ApiBody({ type: CreateBranchDto })
    create(
      @Param('tenantId') tenantId: string,
      @Body() createBranchDto: CreateBranchDto,
    ) {
      return this.branchesService.create({ ...createBranchDto, tenantId });
    }
  
    @Get()
    // @Roles('tenant_admin', 'superadmin', 'branch_manager')
    @ApiOperation({ summary: 'Get all branches for a tenant' })
    @ApiResponse({ status: 200, description: 'List of branches', type: [Branch] })
    @ApiParam({ name: 'tenantId', type: String, description: 'Tenant ID' })
    findAll(@Param('tenantId') tenantId: string) {
      return this.branchesService.findAll(tenantId);
    }
  
    @Get(':id')
    @Roles('tenant_admin', 'superadmin', 'branch_manager')
    @ApiOperation({ summary: 'Get a branch by ID' })
    @ApiResponse({ status: 200, description: 'Branch details', type: Branch })
    @ApiResponse({ status: 404, description: 'Branch not found' })
    @ApiParam({ name: 'tenantId', type: String, description: 'Tenant ID' })
    @ApiParam({ name: 'id', type: String, description: 'Branch ID' })
    findOne(
      @Param('tenantId', ParseUUIDPipe) tenantId: string,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      return this.branchesService.findOne(id, tenantId);
    }
  
    @Patch(':id')
    @Roles('tenant_admin', 'superadmin', 'branch_manager')
    @ApiOperation({ summary: 'Update a branch' })
    @ApiResponse({ status: 200, description: 'Branch updated', type: Branch })
    @ApiResponse({ status: 404, description: 'Branch not found' })
    @ApiParam({ name: 'tenantId', type: String, description: 'Tenant ID' })
    @ApiParam({ name: 'id', type: String, description: 'Branch ID' })
    @ApiBody({ type: UpdateBranchDto })
    update(
      @Param('tenantId', ParseUUIDPipe) tenantId: string,
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateBranchDto: UpdateBranchDto,
    ) {
      return this.branchesService.update(id, tenantId, updateBranchDto);
    }
  
    @Delete(':id')
    @Roles('tenant_admin', 'superadmin')
    @ApiOperation({ summary: 'Deactivate a branch' })
    @ApiResponse({ status: 200, description: 'Branch deactivated', type: Branch })
    @ApiResponse({ status: 404, description: 'Branch not found' })
    @ApiParam({ name: 'tenantId', type: String, description: 'Tenant ID' })
    @ApiParam({ name: 'id', type: String, description: 'Branch ID' })
    deactivate(
      @Param('tenantId', ParseUUIDPipe) tenantId: string,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      return this.branchesService.deactivate(id, tenantId);
    }
  }