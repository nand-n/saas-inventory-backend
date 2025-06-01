import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockAdjustment } from './entities/stock-adjustment.entity';
import {
  CreateStockAdjustmentDto,
  UpdateStockAdjustmentDto,
} from './dtos/stock-adjustment.dto';
import { CreateJournalDto } from '../accounting/dto/create-journal.dto';
import { InventoryItem } from './entities/inventory-item.entity';
import { JournalService } from '../accounting/journal.service';

@Injectable()
export class StockAdjustmentService {
  constructor(
    @InjectRepository(StockAdjustment)
    private readonly stockAdjustmentRepository: Repository<StockAdjustment>,
    @InjectRepository(InventoryItem)
    private itemRepository: Repository<InventoryItem>,
    private readonly journalService: JournalService,
  ) {}
  async create(createDto: CreateStockAdjustmentDto): Promise<StockAdjustment> {
    // 1. Fetch the inventory item with relations
    const item = await this.itemRepository.findOne({
      where: { id: createDto.item_id },
      relations: ['branch', 'category'],
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    // 2. Determine adjustment direction
    const isIncrease = createDto.quantity > 0;

    // 3. Calculate total cost (absolute value for accounting)
    const totalValue = Math.abs(item.unit_cost * createDto.quantity);

    // 4. Determine account IDs
    const inventoryAccountId = createDto.inventory_account_id;
    const adjustmentAccountId = isIncrease
      ? createDto.adjustment_gain_account_id // For increases
      : createDto.adjustment_loss_account_id; // For decreases (loss/expired/damage)

    if (!inventoryAccountId || !adjustmentAccountId) {
      throw new BadRequestException(
        'Missing account mapping for journal entry',
      );
    }

    // 5. Create journal entry to reflect adjustment
    const journalDto: CreateJournalDto = {
      tenantId: item.category.tenant_id,
      date: new Date(),
      description: `Stock Adjustment - ${
        isIncrease ? 'Increase' : 'Decrease'
      } for item: ${item.item_name}`,
      lines: isIncrease
        ? [
            {
              accountId: inventoryAccountId,
              debit: totalValue,
              credit: 0,
            },
            {
              accountId: adjustmentAccountId,
              debit: 0,
              credit: totalValue,
            },
          ]
        : [
            {
              accountId: adjustmentAccountId,
              debit: totalValue,
              credit: 0,
            },
            {
              accountId: inventoryAccountId,
              debit: 0,
              credit: totalValue,
            },
          ],
    };

    await this.journalService.create(journalDto);
    const stockAdjustment = this.stockAdjustmentRepository.create(createDto);

    return await this.stockAdjustmentRepository.save(stockAdjustment);
  }

  async update(
    id: string,
    updateDto: UpdateStockAdjustmentDto,
  ): Promise<StockAdjustment> {
    const stockAdjustment = await this.stockAdjustmentRepository.preload({
      id,
      ...updateDto,
    });
    if (!stockAdjustment) {
      throw new NotFoundException(`Stock Adjustment with ID ${id} not found`);
    }
    return await this.stockAdjustmentRepository.save(stockAdjustment);
  }

  async findAll(): Promise<StockAdjustment[]> {
    return await this.stockAdjustmentRepository.find();
  }

  async findOne(id: string): Promise<StockAdjustment> {
    const stockAdjustment = await this.stockAdjustmentRepository.findOne({
      where: { id },
    });
    if (!stockAdjustment) {
      throw new NotFoundException(`Stock Adjustment with ID ${id} not found`);
    }
    return stockAdjustment;
  }

  async delete(id: string): Promise<void> {
    const result = await this.stockAdjustmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Stock Adjustment with ID ${id} not found`);
    }
  }
}
