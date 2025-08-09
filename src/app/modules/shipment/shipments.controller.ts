import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';

import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly service: ShipmentsService) {}

  @Post()
  create(@Body() dto: CreateShipmentDto): Promise<Shipment> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<Shipment[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Shipment> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateShipmentDto,
  ): Promise<Shipment> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
