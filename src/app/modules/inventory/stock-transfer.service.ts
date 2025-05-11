import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockTransfer } from './entities/stock-transfer.entity';
import { CreateStockTransferDto, UpdateStockTransferDto } from './dtos/stock-transfer.dto';

@Injectable()
export class StockTransferService {
  constructor(
    @InjectRepository(StockTransfer)
    private readonly stockTransferRepository: Repository<StockTransfer>,
  ) {}

  async create(createDto: CreateStockTransferDto): Promise<StockTransfer> {
    const stockTransfer = this.stockTransferRepository.create(createDto);
    return await this.stockTransferRepository.save(stockTransfer);
  }

  async update(id: string, updateDto: UpdateStockTransferDto): Promise<StockTransfer> {
    const stockTransfer = await this.stockTransferRepository.preload({ id, ...updateDto });
    if (!stockTransfer) {
      throw new NotFoundException(`Stock Transfer with ID ${id} not found`);
    }
    return await this.stockTransferRepository.save(stockTransfer);
  }

  async findAll(): Promise<StockTransfer[]> {
    return await this.stockTransferRepository.find();
  }

  async findOne(id: string): Promise<StockTransfer> {
    const stockTransfer = await this.stockTransferRepository.findOne({ where: { id } });
    if (!stockTransfer) {
      throw new NotFoundException(`Stock Transfer with ID ${id} not found`);
    }
    return stockTransfer;
  }

  async delete(id: string): Promise<void> {
    const result = await this.stockTransferRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Stock Transfer with ID ${id} not found`);
    }
  }
}