import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InventoryCategoryService } from './inventory-category.service';
import { CreateInventoryCategoryDto, UpdateInventoryCategoryDto } from './dtos/inventory-category.dto';
import { AuthGuard } from '@root/src/core/guards/auth.guard';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';


@Controller('inventory-categories')
export class InventoryCategoryController {
  constructor(private readonly inventoryCategoryService: InventoryCategoryService) {}

  @Post()
  async create(@Body() createDto: CreateInventoryCategoryDto) {
    return await this.inventoryCategoryService.create(createDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as User
    return await this.inventoryCategoryService.findAll(user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.inventoryCategoryService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateInventoryCategoryDto) {
    return await this.inventoryCategoryService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.inventoryCategoryService.delete(id);
  }
}
