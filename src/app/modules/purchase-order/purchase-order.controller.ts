import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto } from './dtos/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dtos/update-purchase-order.dto';

@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly poService: PurchaseOrderService) {}

  @Post()
  create(@Body() dto: CreatePurchaseOrderDto) {
    return this.poService.create(dto);
  }

  @Get()
  findAll() {
    return this.poService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto) {
    return this.poService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poService.remove(id);
  }
}
