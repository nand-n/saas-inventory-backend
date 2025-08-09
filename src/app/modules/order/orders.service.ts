import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepo.create(dto);
    return this.orderRepo.save(order);
  }

  findAllOrders(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['orderItems', 'shipments'] });
  }

  async findOrder(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['orderItems', 'shipments'] });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOrder(id);
    Object.assign(order, dto);
    return this.orderRepo.save(order);
  }

  async removeOrder(id: string): Promise<void> {
    const order = await this.findOrder(id);
    await this.orderRepo.remove(order);
  }

  // OrderItems
  async addItem(dto: CreateOrderItemDto): Promise<OrderItem> {
    const item = this.itemRepo.create(dto);
    return this.itemRepo.save(item);
  }

  async updateItem(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const item = await this.itemRepo.findOne({where: { id }, relations: ['order']});
    if (!item) throw new NotFoundException(`OrderItem #${id} not found`);
    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async removeItem(id: string): Promise<void> {
    const item = await this.itemRepo.findOne({where: { id }, relations: ['order']});
    if (!item) throw new NotFoundException(`OrderItem ${id} not found`);
    await this.itemRepo.remove(item);
  }
}