import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchInventory } from './entities/branch-inventory.entity';
import { CreateBranchInventoryDto, UpdateBranchInventoryDto } from './dtos/branch-inventory.dto';

@Injectable()
export class BranchInventoryService {
  constructor(
    @InjectRepository(BranchInventory)
    private readonly branchInventoryRepository: Repository<BranchInventory>,
  ) {}

  async create(createDto: CreateBranchInventoryDto): Promise<BranchInventory> {
    const branchInventory = this.branchInventoryRepository.create(createDto);
    return await this.branchInventoryRepository.save(branchInventory);
  }

  async update(id: string, updateDto: UpdateBranchInventoryDto): Promise<BranchInventory> {
    const branchInventory = await this.branchInventoryRepository.preload({ id, ...updateDto });
    if (!branchInventory) {
      throw new NotFoundException(`Branch Inventory with ID ${id} not found`);
    }
    return await this.branchInventoryRepository.save(branchInventory);
  }

  async findAll(): Promise<BranchInventory[]> {
    return await this.branchInventoryRepository.find({
      relations: ['item'],
    });
  }

    async findAllWithTenantId(tenantId: string): Promise<BranchInventory[]> {
      return await this.branchInventoryRepository
        .createQueryBuilder('branchInventory')
        .leftJoinAndSelect('branchInventory.branch', 'branch')
        .leftJoinAndSelect('branchInventory.item', 'item')
        .where('branch.tenantId = :tenantId', { tenantId })
        .getMany();
  }

  async findOne(id: string): Promise<BranchInventory> {
    const branchInventory = await this.branchInventoryRepository.findOne({ where: { id } });
    if (!branchInventory) {
      throw new NotFoundException(`Branch Inventory with ID ${id} not found`);
    }
    return branchInventory;
  }

  async delete(id: string): Promise<void> {
    const result = await this.branchInventoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Branch Inventory with ID ${id} not found`);
    }
  }
}