import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.service.createOrder(dto);
  }

  @Get()
  findAllOrders(): Promise<Order[]> {
    return this.service.findAllOrders();
  }

  @Get(':id')
  findOrder(@Param('id') id: string): Promise<Order> {
    return this.service.findOrder(id);
  }

  @Patch(':id')
  updateOrder(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<Order> {
    return this.service.updateOrder(id, dto);
  }

  @Delete(':id')
  removeOrder(@Param('id') id: string): Promise<void> {
    return this.service.removeOrder(id);
  }

  // Order items
  @Post('items')
  addItem(@Body() dto: CreateOrderItemDto): Promise<OrderItem> {
    return this.service.addItem(dto);
  }

  @Patch('items/:id')
  updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    return this.service.updateItem(id, dto);
  }

  @Delete('items/:id')
  removeItem(@Param('id') id: string): Promise<void> {
    return this.service.removeItem(id);
  }
}