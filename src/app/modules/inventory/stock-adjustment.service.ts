import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockAdjustment } from './entities/stock-adjustment.entity';
import { CreateStockAdjustmentDto, UpdateStockAdjustmentDto } from './dtos/stock-adjustment.dto';

@Injectable()
export class StockAdjustmentService {
  constructor(
    @InjectRepository(StockAdjustment)
    private readonly stockAdjustmentRepository: Repository<StockAdjustment>,
  ) {}

  async create(createDto: CreateStockAdjustmentDto): Promise<StockAdjustment> {
    const stockAdjustment = this.stockAdjustmentRepository.create(createDto);
    return await this.stockAdjustmentRepository.save(stockAdjustment);
  }

  async update(id: string, updateDto: UpdateStockAdjustmentDto): Promise<StockAdjustment> {
    const stockAdjustment = await this.stockAdjustmentRepository.preload({ id, ...updateDto });
    if (!stockAdjustment) {
      throw new NotFoundException(`Stock Adjustment with ID ${id} not found`);
    }
    return await this.stockAdjustmentRepository.save(stockAdjustment);
  }

  async findAll(): Promise<StockAdjustment[]> {
    return await this.stockAdjustmentRepository.find();
  }

  async findOne(id: string): Promise<StockAdjustment> {
    const stockAdjustment = await this.stockAdjustmentRepository.findOne({ where: { id } });
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