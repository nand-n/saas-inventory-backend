import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { CreateStockTransferDto, UpdateStockTransferDto } from './dtos/stock-transfer.dto';

@Controller('stock-transfers')
export class StockTransferController {
  constructor(private readonly stockTransferService: StockTransferService) {}

  @Post()
  async create(@Body() createDto: CreateStockTransferDto) {
    return await this.stockTransferService.create(createDto);
  }

  @Get()
  async findAll() {
    return await this.stockTransferService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.stockTransferService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateStockTransferDto) {
    return await this.stockTransferService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.stockTransferService.delete(id);
  }
}
