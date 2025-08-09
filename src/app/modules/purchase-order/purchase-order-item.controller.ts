import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseOrderItemService } from './purchase-order-item.service';
import { CreatePurchaseOrderItemDto } from './dtos/create-purchase-order-item.dto';
import { UpdatePurchaseOrderItemDto } from './dtos/update-purchase-order-item.dto';

@Controller('purchase-order-items')
export class PurchaseOrderItemController {
  constructor(private readonly poiService: PurchaseOrderItemService) {}

  @Post()
  create(@Body() dto: CreatePurchaseOrderItemDto) {
    return this.poiService.create(dto);
  }

  @Get()
  findAll() {
    return this.poiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poiService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderItemDto) {
    return this.poiService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poiService.remove(id);
  }
}
