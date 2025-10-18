import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity, OpportunityStatus } from './entities/opportunity.entity';
import { CRMCustomer } from '../customer/entities/customer.entity';
import { CreateOpportunityDto } from './dtos/create-opportunity.dto';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepo: Repository<Opportunity>,
    @InjectRepository(CRMCustomer)
    private readonly customerRepo: Repository<CRMCustomer>,
  ) {}

  async create(dto: CreateOpportunityDto) {
    const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const opportunity = this.opportunityRepo.create({
      ...dto,
      customer,
    });

    return this.opportunityRepo.save(opportunity);
  }

  findAll() {
    return this.opportunityRepo.find({ relations: ['customer'] });
  }

  async findOne(id: string) {
    const opportunity = await this.opportunityRepo.findOne({ where: { id }, relations: ['customer'] });
    if (!opportunity) throw new NotFoundException('Opportunity not found');
    return opportunity;
  }

  async update(id: string, partial: Partial<CreateOpportunityDto>) {
    const existing = await this.findOne(id);
    Object.assign(existing, partial);
    return this.opportunityRepo.save(existing);
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    return this.opportunityRepo.remove(existing);
  }
}
