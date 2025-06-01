import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InventoryItemService } from './inventory-item.service';
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
} from './dtos/inventory-item.dto';
import { AuthGuard } from '@root/src/core/guards/auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';

@Controller('inventory-items')
@UseGuards(AuthGuard, RolesGuard)
export class InventoryItemController {
  constructor(private readonly inventoryItemService: InventoryItemService) {}

  @Post()
  async create(@Request() req: any, @Body() createDto: CreateInventoryItemDto) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return await this.inventoryItemService.create({ ...createDto, tenantId });
  }

  @Get()
  async findAll() {
    return await this.inventoryItemService.findAll();
  }

  @Get('grouped/by-branch')
  async groupByBranch() {
    return await this.inventoryItemService.groupByBranch();
  }

  @Get('summary/by-branch')
  async summarizeGroupedByBranch() {
    return await this.inventoryItemService.summarizeGroupedByBranch();
  }
  @Get('summary/distribution')
  async getInventorySummaryByBranch(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.inventoryItemService.getInventorySummary(
      tenantId,
      startDate,
      endDate,
    );
  }
  @Get('branch/:branchId')
  async findByBranchId(@Param('branchId') branchId: string) {
    return await this.inventoryItemService.findByBranchId(branchId);
  }

  @Get('category/:categoryId')
  async findByCategoryId(@Param('categoryId') categoryId: string) {
    return await this.inventoryItemService.findByCategoryId(categoryId);
  }

  @Get('sku/:sku')
  async findBySku(@Param('sku') sku: string) {
    return await this.inventoryItemService.findBySku(sku);
  }

  @Get('sku/:sku/branch/:branchId')
  async findBySkuAndBranchId(
    @Param('sku') sku: string,
    @Param('branchId') branchId: string,
  ) {
    return await this.inventoryItemService.findBySkuAndBranchId(sku, branchId);
  }

  @Get('category/:categoryId/branch/:branchId')
  async findByCategoryIdAndBranchId(
    @Param('categoryId') categoryId: string,
    @Param('branchId') branchId: string,
  ) {
    return await this.inventoryItemService.findByCategoryIdAndBranchId(
      categoryId,
      branchId,
    );
  }

  @Get('category/:categoryId/sku/:sku')
  async findByCategoryIdAndSku(
    @Param('categoryId') categoryId: string,
    @Param('sku') sku: string,
  ) {
    return await this.inventoryItemService.findByCategoryIdAndSku(
      categoryId,
      sku,
    );
  }

  @Get('category/:categoryId/sku/:sku/branch/:branchId')
  async findByCategoryIdAndSkuAndBranchId(
    @Param('categoryId') categoryId: string,
    @Param('sku') sku: string,
    @Param('branchId') branchId: string,
  ) {
    return await this.inventoryItemService.findByCategoryIdAndSkuAndBranchId(
      categoryId,
      sku,
      branchId,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.inventoryItemService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateInventoryItemDto,
  ) {
    return await this.inventoryItemService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.inventoryItemService.delete(id);
  }
}
