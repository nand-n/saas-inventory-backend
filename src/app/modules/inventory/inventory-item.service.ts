// inventory-item.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
} from './dtos/inventory-item.dto';
import { CreateJournalDto } from '../accounting/dto/create-journal.dto';
import { JournalService } from '../accounting/journal.service';
import { InventoryCategory } from './entities/inventory-category.entity';

@Injectable()
export class InventoryItemService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly itemRepository: Repository<InventoryItem>,
    private journalService: JournalService,
    private readonly dataSource: DataSource,
  ) { }

  async create(createDto: CreateInventoryItemDto): Promise<InventoryItem> {
    const item = this.itemRepository.create(createDto);
    const savedItem = await this.itemRepository.save(item);
    const totalCost = createDto.unit_cost * createDto.quantity;
    const journalDto: CreateJournalDto = {
      tenantId: createDto.tenantId ?? '',
      date: new Date(),
      description: `Inventory Items purchase for item: ${createDto.item_name}`,
      lines: [
        {
          accountId: createDto.inventory_account_id,
          debit: totalCost,
          credit: 0,
        },
        {
          accountId: createDto.payment_account_id,
          debit: 0,
          credit: totalCost,
        },
      ],
    };

    await this.journalService.create(journalDto);

    return savedItem;
  }

  async update(
    id: string,
    updateDto: UpdateInventoryItemDto,
  ): Promise<InventoryItem> {
    const item = await this.itemRepository.preload({ id, ...updateDto });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return await this.itemRepository.save(item);
  }

  async findAll(): Promise<InventoryItem[]> {
    return await this.itemRepository.find();
  }

  async findOne(id: string): Promise<InventoryItem> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async delete(id: string): Promise<void> {
    const result = await this.itemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }
  async groupByBranch(): Promise<
    {
      branch_id: string;
      branch_name: string;
      items: InventoryItem[];
    }[]
  > {
    const rawItems = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.branch', 'branch')
      .orderBy('branch.id', 'ASC')
      .addOrderBy('item.item_name', 'ASC')
      .getMany();

    const groupedMap = new Map<
      string,
      { branch_id: string; branch_name: string; items: InventoryItem[] }
    >();

    for (const item of rawItems) {
      const branchId = item.branch?.id;
      if (!branchId) continue;

      if (!groupedMap.has(branchId)) {
        groupedMap.set(branchId, {
          branch_id: branchId,
          branch_name: item.branch.name,
          items: [],
        });
      }

      groupedMap.get(branchId)!.items.push(item);
    }

    return Array.from(groupedMap.values());
  }
  async summarizeGroupedByBranch() {
    return await this.itemRepository
      .createQueryBuilder('item')
      .leftJoin('item.branch', 'branch')
      .select('branch.id', 'branch_id')
      .addSelect('branch.name', 'branch_name')
      .addSelect('COUNT(item.id)', 'total_items')
      .addSelect('SUM(item.quantity)', 'total_quantity')
      .addSelect('SUM(item.unit_price * item.quantity)', 'total_value')
      .groupBy('branch.id')
      .addGroupBy('branch.name')
      .getRawMany();
  }

  async findByBranchId(branchId: string): Promise<InventoryItem[]> {
    return await this.itemRepository.find({ where: { branch_id: branchId } });
  }
  async findByCategoryId(categoryId: string): Promise<InventoryItem[]> {
    return await this.itemRepository.find({
      where: { category_id: categoryId },
    });
  }
  async findBySku(sku: string): Promise<InventoryItem[]> {
    return await this.itemRepository.find({ where: { sku } });
  }
  async findBySkuAndBranchId(
    sku: string,
    branchId: string,
  ): Promise<InventoryItem[]> {
    return await this.itemRepository.find({
      where: { sku, branch_id: branchId },
    });
  }
  async findByCategoryIdAndBranchId(
    categoryId: string,
    branchId: string,
  ): Promise<InventoryItem[]> {
    return await this.itemRepository.find({
      where: { category_id: categoryId, branch_id: branchId },
    });
  }
  async findByCategoryIdAndSku(
    categoryId: string,
    sku: string,
  ): Promise<InventoryItem[]> {
    return await this.itemRepository.find({
      where: { category_id: categoryId, sku },
    });
  }
  async findByCategoryIdAndSkuAndBranchId(
    categoryId: string,
    sku: string,
    branchId: string,
  ): Promise<InventoryItem[]> {
    return await this.itemRepository.find({
      where: { category_id: categoryId, sku, branch_id: branchId },
    });
  }
  async decreaseQuantity(
    itemId: string,
    qty: number,
    manager: EntityManager = this.dataSource.manager,
  ) {
    const repo = manager.getRepository(InventoryItem);
    const item = await repo.findOneOrFail({ where: { id: itemId } });
    if (item.quantity < qty) throw new BadRequestException('Out of stock');
    item.quantity -= qty;
    await repo.save(item);
  }
  async getInventorySummary(
    tenantId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const query = this.itemRepository
      .createQueryBuilder('item')
      .leftJoin('item.category', 'category')
      .leftJoin('item.branch', 'branch')
      .select('branch.name', 'branch')
      .addSelect('SUM(item.quantity)', 'stock')
      .addSelect(
        `SUM(CASE WHEN item.quantity <= item.reorder_level AND item.quantity > 0 THEN 1 ELSE 0 END)`,
        'lowStock',
      )
      .addSelect(
        `SUM(CASE WHEN item.quantity = 0 THEN 1 ELSE 0 END)`,
        'outOfStock',
      )
      .where('branch.tenantId = :tenantId', { tenantId }) // ✅ Updated line
      .groupBy('branch.name');
    if (startDate && endDate) {
      const nextDay = new Date(
        new Date(endDate).getTime() + 24 * 60 * 60 * 1000,
      );
      query.andWhere(
        'item.createdAt >= :startDate AND item.createdAt < :nextDay',
        {
          startDate,
          nextDay,
        },
      );
    }

    return query.getRawMany();
  }

  async count() {
    return this.itemRepository.count();
  }
}
