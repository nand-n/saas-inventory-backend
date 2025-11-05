import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoodsReceipt, GoodsReceiptStatus, GRNQCStatus } from './entities/grn.entity';
import { GRNItem } from './entities/grn-item.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import { CreateGoodsReceiptDto } from './dtos/create-grn.dto';
import { UpdateGoodsReceiptDto } from './dtos/update-grn.dto';

@Injectable()
export class GoodsReceiptService {
  constructor(
    @InjectRepository(GoodsReceipt)
    private readonly grnRepository: Repository<GoodsReceipt>,

    @InjectRepository(GRNItem)
    private readonly grnItemRepository: Repository<GRNItem>,

    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  // ---------- CRUD ----------
  async create(dto: CreateGoodsReceiptDto): Promise<GoodsReceipt> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id: dto.purchaseOrderId },
    });
    if (!purchaseOrder) throw new NotFoundException('Purchase order not found');

    const grn = this.grnRepository.create({
      grnNumber: dto.grnNumber,
      purchaseOrder,
      receivedDate: dto.receivedDate,
      receivedBy: dto.receivedBy,
      warehouse: dto.warehouse,
      status: GoodsReceiptStatus.PENDING,
      items: dto.items.map(item => this.grnItemRepository.create(item)),
    });

    return await this.grnRepository.save(grn);
  }

  async findAll(): Promise<GoodsReceipt[]> {
    return await this.grnRepository.find({ relations: ['purchaseOrder', 'items'] });
  }

  async findOne(id: string): Promise<GoodsReceipt> {
    const grn = await this.grnRepository.findOne({
      where: { id },
      relations: ['purchaseOrder', 'items'],
    });
    if (!grn) throw new NotFoundException('Goods receipt not found');
    return grn;
  }

  async update(id: string, dto: UpdateGoodsReceiptDto): Promise<GoodsReceipt> {
    const grn = await this.findOne(id);
    Object.assign(grn, dto);

    if (dto.items) {
      await this.grnItemRepository.delete({ grn: { id } });
      grn.items = dto.items.map((item) => this.grnItemRepository.create({ ...item, grn }));
    }

    return await this.grnRepository.save(grn);
  }

  async remove(id: string): Promise<void> {
    const grn = await this.findOne(id);
    await this.grnRepository.remove(grn);
  }

  // ---------- Approval Workflow ----------
  async approve(id: string, verifiedBy?: string): Promise<GoodsReceipt> {
    const grn = await this.findOne(id);
    if (grn.status !== 'PENDING') throw new BadRequestException('Only pending GRNs can be approved');

    grn.status = GoodsReceiptStatus.APPROVED;
    grn.verifiedBy = verifiedBy || 'system';
    grn.verifiedAt = new Date();

    // TODO: trigger inventory update or accounting here
    return this.grnRepository.save(grn);
  }

  async reject(id: string, verifiedBy?: string): Promise<GoodsReceipt> {
    const grn = await this.findOne(id);
    if (grn.status !== 'PENDING') throw new BadRequestException('Only pending GRNs can be rejected');

    grn.status = GoodsReceiptStatus.REJECTED;
    grn.verifiedBy = verifiedBy || 'system';
    grn.verifiedAt = new Date();

    return this.grnRepository.save(grn);
  }

  // ---------- Quality Control ----------
  async updateQC(id: string, qcStatus: GRNQCStatus, qcRemarks?: string) {
    const grn = await this.findOne(id);
    grn.qcStatus = qcStatus;
    grn.qcRemarks = qcRemarks;
    return this.grnRepository.save(grn);
  }

  // ---------- Partial Receipt / Quantity Adjustment ----------
  async adjustQuantities(id: string, adjustments: { itemId: string; receivedQuantity: number }[]) {
    const grn = await this.findOne(id);
    for (const adj of adjustments) {
      const item = grn.items.find(i => i.id === adj.itemId);
      if (!item) throw new NotFoundException(`GRN item ${adj.itemId} not found`);
      item.receivedQuantity = adj.receivedQuantity;
    }
    return this.grnRepository.save(grn);
  }

  // ---------- Shipment / Supplier Info ----------
  async updateShipment(id: string, shipmentDto: { carrier?: string; trackingNumber?: string; deliveryDate?: string }) {
    const grn = await this.findOne(id);
    Object.assign(grn, shipmentDto);
    return this.grnRepository.save(grn);
  }

  // ---------- Audit / History ----------
  async getHistory(id: string) {
    const grn = await this.findOne(id);
    return {
      id: grn.id,
      status: grn.status,
      verifiedBy: grn.verifiedBy,
      verifiedAt: grn.verifiedAt,
      items: grn.items,
    };
  }

  // ---------- Reporting / Filtering ----------
  async filter(filterDto: { status?: string; warehouse?: string; supplierId?: string }) {
    const query = this.grnRepository.createQueryBuilder('grn')
      .leftJoinAndSelect('grn.purchaseOrder', 'po')
      .leftJoinAndSelect('grn.items', 'items');

    if (filterDto.status) query.andWhere('grn.status = :status', { status: filterDto.status });
    if (filterDto.warehouse) query.andWhere('grn.warehouse = :warehouse', { warehouse: filterDto.warehouse });
    if (filterDto.supplierId) query.andWhere('po.supplierId = :supplierId', { supplierId: filterDto.supplierId });

    return query.getMany();
  }
}
