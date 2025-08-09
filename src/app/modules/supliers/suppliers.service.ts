import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Supplier } from './entities/suplier.entity';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ProductsService } from '../product/products.service';
import { randomInt } from 'crypto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly repo: Repository<Supplier>,
     private readonly productService: ProductsService,
  ) {}

async create(dto: CreateSupplierDto): Promise<Supplier> {
    // 1️⃣ Create and save supplier first

    const supplier = this.repo.create({...dto,code: await this.generateUniqueSupplierCode()});
    const savedSupplier = await this.repo.save(supplier);

    // 2️⃣ Link existing products by IDs using ProductService
    if (dto.productIds?.length) {
      for (const productId of dto.productIds) {
        await this.productService.assignSupplier(productId, savedSupplier.id);
      }
    }

    // 3️⃣ Create new products using ProductService
   const newProducts = dto.newProducts ?? [];
  if (newProducts.length) {
      await this.productService.bulkCreateWithSupplier(
      newProducts,
      savedSupplier.id
    );
  }

    return savedSupplier;
  }

  findAll(): Promise<Supplier[]> {
    return this.repo.find({ relations: ['products', 'shipments'] });
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.repo.findOne({ where: { id }, relations: ['products', 'shipments'] });
    if (!supplier) throw new NotFoundException(`Supplier ${id} not found`);
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, dto);
    return this.repo.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.repo.remove(supplier);
  }
  private async generateUniqueSupplierCode(): Promise<string> {
  let code: string;
  let exists: Supplier | null;

  do {
    code = `SUP-${randomInt(1000, 9999)}`; // example: SUP-4387
    exists = await this.repo.findOne({ where: { code } });
  } while (exists);

  return code;
}
}
