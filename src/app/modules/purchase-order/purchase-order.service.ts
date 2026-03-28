import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';

import { Supplier } from '../supliers/entities/suplier.entity';
import { CreatePurchaseOrderDto } from './dtos/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dtos/update-purchase-order.dto';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private poRepository: Repository<PurchaseOrder>,

    @InjectRepository(PurchaseOrderItem)
    private poItemRepository: Repository<PurchaseOrderItem>,

    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) { }

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const supplier = await this.supplierRepository.findOne({
      where: { id: dto.supplierId },
    });
    if (!supplier) throw new NotFoundException('Supplier not found');

    const poNumber = `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Map DTO items -> PurchaseOrderItem entities
    const items = dto.items.map((itemDto) => {
      const lineTotal = Number(itemDto.quantity) * Number(itemDto.unit_cost);
      const poi = this.poItemRepository.create({
        productName: itemDto.productName,
        unit_cost: itemDto.unit_cost,
        quantity: itemDto.quantity,
        lineTotal,
        productId: itemDto.productId
      });
      return poi;
    });

    // Calculate total amount based on items
    const totalAmount = items.reduce((sum, item) => sum + Number(item.lineTotal), 0);

    const po = this.poRepository.create({
      poNumber,
      supplier,
      status: dto.status,
      orderDate: new Date(dto.orderDate),
      expectedDeliveryDate: new Date(dto.expectedDeliveryDate),
      totalAmount,
      items,
    });

    return await this.poRepository.save(po);
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.poRepository.find({ relations: ['supplier', 'items'] });
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const po = await this.poRepository.findOne({ where: { id }, relations: ['supplier', 'items'] });
    if (!po) throw new NotFoundException('Purchase Order not found');
    return po;
  }

  async update(id: string, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const po = await this.findOne(id);

    if (dto.supplierId) {
      const supplier = await this.supplierRepository.findOne({ where: { id: dto.supplierId } });
      if (!supplier) throw new NotFoundException('Supplier not found');
      po.supplier = supplier;
    }

    Object.assign(po, {
      ...dto,
      orderDate: dto.orderDate ? new Date(dto.orderDate) : po.orderDate,
      expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : po.expectedDeliveryDate,
    });

    return await this.poRepository.save(po);
  }

  async remove(id: string): Promise<void> {
    const po = await this.findOne(id);
    await this.poRepository.remove(po);
  }

  async count() {
    return this.poRepository.count();
  }

  async getStats() {
    const totalOrders = await this.poRepository.count();
    const totalAmount = await this.poRepository
      .createQueryBuilder('po')
      .select('SUM(po.totalAmount)', 'sum')
      .getRawOne();

    return {
      totalOrders,
      totalAmount: Number(totalAmount?.sum || 0),
    };
  }
}
