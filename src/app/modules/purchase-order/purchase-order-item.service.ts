import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import { CreatePurchaseOrderItemDto } from './dtos/create-purchase-order-item.dto';
import { UpdatePurchaseOrderItemDto } from './dtos/update-purchase-order-item.dto';

@Injectable()
export class PurchaseOrderItemService {
  constructor(
    @InjectRepository(PurchaseOrderItem)
    private poiRepository: Repository<PurchaseOrderItem>,
    @InjectRepository(PurchaseOrder)
    private poRepository: Repository<PurchaseOrder>,
  ) {}

  async create(dto: CreatePurchaseOrderItemDto): Promise<PurchaseOrderItem> {
    const purchaseOrder = await this.poRepository.findOne({ where: { id: dto.purchaseOrderId }});
    if (!purchaseOrder) throw new NotFoundException('Purchase Order not found');

    const item = this.poiRepository.create({
      ...dto,
      purchaseOrder,
    });

    return await this.poiRepository.save(item);
  }

  async findAll(): Promise<PurchaseOrderItem[]> {
    return this.poiRepository.find({ relations: ['purchaseOrder'] });
  }

  async findOne(id: string): Promise<PurchaseOrderItem> {
    const item = await this.poiRepository.findOne({ where: { id }, relations: ['purchaseOrder'] });
    if (!item) throw new NotFoundException('Purchase Order Item not found');
    return item;
  }

  async update(id: string, dto: UpdatePurchaseOrderItemDto): Promise<PurchaseOrderItem> {
    const item = await this.findOne(id);

    if (dto.purchaseOrderId) {
      const purchaseOrder = await this.poRepository.findOne({ where: { id: dto.purchaseOrderId }});
      if (!purchaseOrder) throw new NotFoundException('Purchase Order not found');
      item.purchaseOrder = purchaseOrder;
    }

    Object.assign(item, dto);
    return await this.poiRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.poiRepository.remove(item);
  }
}
