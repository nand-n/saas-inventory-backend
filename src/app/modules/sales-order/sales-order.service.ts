import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesOrder } from './entities/sales-order.entity';
import { SalesOrderItem } from './entities/sales-order-item.entity';
import { CreateSalesOrderDto } from './dtos/create-sales-order.dto';
import { UpdateSalesOrderDto } from './dtos/update-sales-order.dto';
import { Customer } from '../customers/entities/customers.entity';

@Injectable()
export class SalesOrderService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly salesOrderRepo: Repository<SalesOrder>,
    @InjectRepository(SalesOrderItem)
    private readonly salesOrderItemRepo: Repository<SalesOrderItem>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) { }

  async create(dto: CreateSalesOrderDto) {
    const customer = await this.customerRepo.findOneByOrFail({ id: dto.customerId });
    const soNumber = `SO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;


    const salesOrder = this.salesOrderRepo.create({
      soNumber: soNumber,
      status: dto.status,
      orderDate: dto.orderDate,
      totalAmount: dto.totalAmount,
      customer,
      items: dto.items.map(item => this.salesOrderItemRepo.create(item))
    });

    return this.salesOrderRepo.save(salesOrder);
  }

  findAll() {
    return this.salesOrderRepo.find({
      relations: ['customer', 'items'],
    });
  }

  async findOne(id: string) {
    const so = await this.salesOrderRepo.findOne({
      where: { id },
      relations: ['customer', 'items'],
    });
    if (!so) throw new NotFoundException('Sales order not found');
    return so;
  }

  async update(id: string, dto: UpdateSalesOrderDto) {
    const so = await this.salesOrderRepo.findOneBy({ id });
    if (!so) throw new NotFoundException('Sales order not found');

    Object.assign(so, dto);
    return this.salesOrderRepo.save(so);
  }

  async remove(id: string) {
    const so = await this.salesOrderRepo.findOneBy({ id });
    if (!so) throw new NotFoundException('Sales order not found');
    return this.salesOrderRepo.remove(so);
  }
}
