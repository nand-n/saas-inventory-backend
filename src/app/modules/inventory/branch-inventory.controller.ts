import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BranchInventoryService } from './branch-inventory.service';
import { CreateBranchInventoryDto, UpdateBranchInventoryDto } from './dtos/branch-inventory.dto';

@Controller('branch-inventory')
export class BranchInventoryController {
  constructor(private readonly branchInventoryService: BranchInventoryService) {}

  @Post()
  async create(@Body() createDto: CreateBranchInventoryDto) {
    return await this.branchInventoryService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.branchInventoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.branchInventoryService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateBranchInventoryDto) {
    return await this.branchInventoryService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.branchInventoryService.delete(id);
  }
}
