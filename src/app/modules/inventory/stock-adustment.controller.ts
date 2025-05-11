import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockAdjustmentService } from './stock-adjustment.service';
import { CreateStockAdjustmentDto, UpdateStockAdjustmentDto } from './dtos/stock-adjustment.dto';

@Controller('stock-adjustments')
export class StockAdjustmentController {
  constructor(private readonly stockAdjustmentService: StockAdjustmentService) {}

  @Post()
  async create(@Body() createDto: CreateStockAdjustmentDto) {
    return await this.stockAdjustmentService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.stockAdjustmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.stockAdjustmentService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateStockAdjustmentDto) {
    return await this.stockAdjustmentService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.stockAdjustmentService.delete(id);
  }
}