import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async bulkCreateWithSupplier(
  products: CreateProductDto[],
  supplierId: string
): Promise<Product[]> {
  const productEntities = products.map(dto =>
    this.repo.create({
      ...dto,
      unit_price: dto.unit_price,
      unit_cost: dto.unit_cost,
      supplier: { id: supplierId },
      category: { id: dto.category_id },
      branch: { id: dto.branch_id },
    })
  );

  return await this.repo.save(productEntities);
}

 async bulkCreateWithCustomer(
  products: CreateProductDto[],
  customerId: string
): Promise<Product[]> {
  const productEntities = products.map(dto =>
    this.repo.create({
      ...dto,
      unit_price: dto.unit_price,
      unit_cost: dto.unit_cost,
      customer: { id: customerId },
      category: { id: dto.category_id },
      branch: { id: dto.branch_id },
    })
  );

  return await this.repo.save(productEntities);
}

  findAll(): Promise<Product[]> {
    return this.repo.find({ relations: ['supplier', 'orderItems'] });
  }

  async assignSupplier(productId: string, supplierId: string): Promise<void> {
  await this.repo.update(
    { id: productId },
    { supplier: { id: supplierId } }
  );
}



async assignCustomer (productId: string, customerId: string): Promise<void> {
  await this.repo.update(
    { id: productId },
    { customer: { id: customerId } }
  );
}


  async findOne(id: string): Promise<Product> {
    const product = await this.repo.findOne({ where: { id }, relations: ['supplier', 'orderItems'] });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.repo.remove(product);
  }
}
