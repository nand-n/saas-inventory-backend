import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CRMCustomer } from './entities/customer.entity';
import { CreateCRMCustomerDto } from './dtos/create-customer.dto';
import { UpdateCRMCustomerDto } from './dtos/update-customer.dto';


@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CRMCustomer)
    private readonly customerRepo: Repository<CRMCustomer>,
  ) {}

  create(dto: CreateCRMCustomerDto) {
    const customer = this.customerRepo.create(dto);
    return this.customerRepo.save(customer);
  }

  findAll() {
    return this.customerRepo.find({ relations: ['opportunities', 'interactions'] });
  }

  async findOne(id: string) {
    const customer = await this.customerRepo.findOne({ where: { id }, relations: ['opportunities', 'interactions'] });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, dto: UpdateCRMCustomerDto) {
    await this.customerRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    return this.customerRepo.remove(customer);
  }
}
