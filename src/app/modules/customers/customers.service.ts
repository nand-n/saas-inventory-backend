import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customers.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { randomInt } from 'crypto';
import { ProductsService } from '../product/products.service';
import { PaginationService } from 'src/core/pagination/pagination.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/core/commonDto/pagination-dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly productService: ProductsService,
    private readonly paginationService: PaginationService,
  ) { }

  async create(dto: CreateCustomerDto) {
    const customer = this.customerRepo.create({ ...dto, code: await this.generateUniqueCustomerCode() });
    const savedCustomer = await this.customerRepo.save(customer);

    // 2️⃣ Link existing products by IDs using ProductService
    if (dto.productIds?.length) {
      for (const productId of dto.productIds) {
        await this.productService.assignCustomer(productId, savedCustomer.id);
      }
    }

    // 3️⃣ Create new products using ProductService
    const newProducts = dto.newProducts ?? [];
    if (newProducts.length) {
      await this.productService.bulkCreateWithCustomer(
        newProducts,
        savedCustomer.id
      );
    }

    return savedCustomer
  }

  findAll(paginationDto: PaginationDto): Promise<Pagination<Customer>> {
    return this.paginationService.paginateWithSearch(
      this.customerRepo,
      'customer',
      paginationDto,
      ['firstName', 'lastName', 'email', 'phone']
    );
  }

  async findOne(id: string) {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: ['salesOrders', 'shipments'],
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    Object.assign(customer, dto);
    return this.customerRepo.save(customer);
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    return this.customerRepo.remove(customer);
  }

  private async generateUniqueCustomerCode(): Promise<string> {
    let code: string;
    let exists: Customer | null;

    do {
      code = `CUST-${randomInt(1000, 9999)}`; // example: SUP-4387
      exists = await this.customerRepo.findOne({ where: { code } });
    } while (exists);

    return code;
  }

  async count() {
    return this.customerRepo.count();
  }
}
