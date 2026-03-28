import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from '../supliers/entities/suplier.entity';
import { RFQ, RFQStatus } from './entities/rfq.entity';
import { CreateRFQDto } from './dtos/create-rfq.dto';
import { UpdateRFQDto } from './dtos/update-rfq.dto';
import { ProductsService } from '../product/products.service';
import { PurchaseOrder, PurchaseOrderStatus } from '../purchase-order/entities/purchase-order.entity';
import { PurchaseOrderItem } from '../purchase-order/entities/purchase-order-item.entity';

@Injectable()
export class RFQService {
  constructor(
    @InjectRepository(RFQ)
    private readonly rfqRepository: Repository<RFQ>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(PurchaseOrder)
    private readonly poRepository: Repository<PurchaseOrder>,
  ) { }

  async create(createRfqDto: CreateRFQDto): Promise<RFQ> {
    const rfqNumber = `RFQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const rfq = this.rfqRepository.create({ ...createRfqDto, rfqNumber });
    return this.rfqRepository.save(rfq);
  }

  async sendRFQ(id: string): Promise<RFQ> {
    const rfq = await this.findOne(id);
    rfq.status = RFQStatus.SENT;
    rfq.issuedDate = new Date();
    return this.rfqRepository.save(rfq);
  }

  async submitBid(rfqId: string, supplierId: string, itemsBid: { rfqItemId: string, unitPrice: number, quantity: number, leadTime?: number, note?: string }[]): Promise<RFQ> {
    const rfq = await this.findOne(rfqId);
    const rfqSupplier = rfq.suppliers?.find(s => s.supplier.id === supplierId);

    if (!rfqSupplier) throw new NotFoundException('Supplier not invited to this RFQ');

    rfqSupplier.hasResponded = true;
    rfqSupplier.responseDate = new Date();
    rfqSupplier.totalBidAmount = itemsBid.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

    itemsBid.forEach(bid => {
      const supplierItem = rfqSupplier.items?.find(si => si.rfqItem?.id === bid.rfqItemId);
      if (supplierItem) {
        supplierItem.unitPrice = bid.unitPrice;
        supplierItem.quantity = bid.quantity;
        supplierItem.totalPrice = bid.unitPrice * bid.quantity;
        if (bid.leadTime !== undefined) supplierItem.leadTime = bid.leadTime;
        if (bid.note !== undefined) supplierItem.note = bid.note;
      }
    });

    return this.rfqRepository.save(rfq);
  }

  async awardItems(rfqId: string, supplierId: string, itemIds: string[]): Promise<RFQ> {
    const rfq = await this.findOne(rfqId);
    const rfqSupplier = rfq.suppliers?.find(s => s.supplier.id === supplierId);
    if (!rfqSupplier) throw new NotFoundException('Supplier not found in this RFQ');

    rfqSupplier.items.forEach(item => {
      if (itemIds.includes(item.id)) {
        item.isSelected = true;
        item.isAwarded = true;
        item.awardedAt = new Date();
      }
    });

    rfq.status = RFQStatus.AWARDED;
    return this.rfqRepository.save(rfq);
  }

  async generatePO(rfqId: string): Promise<PurchaseOrder[]> {
    const rfq = await this.findOne(rfqId);
    const pos: PurchaseOrder[] = [];

    // Group awarded items by supplier
    const awardedSuppliers = rfq.suppliers.filter(s => s.items.some(i => i.isAwarded));

    for (const rfqSupplier of awardedSuppliers) {
      const awardedItems = rfqSupplier.items.filter(i => i.isAwarded);

      const po = this.poRepository.create({
        poNumber: `PO-RFQ-${rfq.rfqNumber}-${rfqSupplier.supplier.code}`,
        supplier: rfqSupplier.supplier,
        orderDate: new Date(),
        totalAmount: awardedItems.reduce((acc, i) => acc + Number(i.totalPrice), 0),
        status: PurchaseOrderStatus.DRAFT,
        rfq: rfq,
        items: awardedItems.map(ai => ({
          productId: ai.rfqItem.productId,
          productName: ai.rfqItem.productName,
          quantity: ai.quantity,
          unitPrice: ai.unitPrice,
          totalPrice: ai.totalPrice
        }))
      });

      pos.push(await this.poRepository.save(po));
    }

    rfq.status = RFQStatus.CLOSED;
    await this.rfqRepository.save(rfq);

    return pos;
  }

  async findAll(): Promise<RFQ[]> {
    return this.rfqRepository.find({ relations: ['suppliers', 'items', 'suppliers.supplier', 'suppliers.items'] });
  }

  async findOne(id: string): Promise<RFQ> {
    const rfq = await this.rfqRepository.findOne({
      where: { id },
      relations: ['suppliers', 'items', 'suppliers.supplier', 'suppliers.items']
    });
    if (!rfq) throw new NotFoundException('RFQ not found');
    return rfq;
  }

  async update(id: string, updateRfqDto: UpdateRFQDto): Promise<RFQ> {
    const rfq = await this.findOne(id);
    Object.assign(rfq, updateRfqDto);
    return this.rfqRepository.save(rfq);
  }

  async remove(id: string): Promise<void> {
    const rfq = await this.findOne(id);
    await this.rfqRepository.remove(rfq);
  }
}
