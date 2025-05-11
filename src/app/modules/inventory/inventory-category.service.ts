// inventory-category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryCategory } from './entities/inventory-category.entity';
import { CreateInventoryCategoryDto, UpdateInventoryCategoryDto } from './dtos/inventory-category.dto';

@Injectable()
export class InventoryCategoryService {
  constructor(
    @InjectRepository(InventoryCategory)
    private readonly categoryRepository: Repository<InventoryCategory>,
  ) {}

  async create(createDto: CreateInventoryCategoryDto): Promise<InventoryCategory> {
    const category = this.categoryRepository.create(createDto);
    return await this.categoryRepository.save(category);
  }

  async update(id: string, updateDto: UpdateInventoryCategoryDto): Promise<InventoryCategory> {
    const category = await this.categoryRepository.preload({ id, ...updateDto });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return await this.categoryRepository.save(category);
  }
  async findAllWithTenant(tenant_id?: string): Promise<InventoryCategory[]> {
    if (tenant_id) {
      return await this.categoryRepository.find({ where: { tenant_id } });
    }
    return await this.categoryRepository.find();
  }
  async findAll(tenantId?:string): Promise<InventoryCategory[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: string): Promise<InventoryCategory> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async delete(id: string): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}