import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction } from './entities/interaction.entity';
import { CRMCustomer } from '../customer/entities/customer.entity';
import { CreateInteractionDto } from './dtos/create-interaction.dto';

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(Interaction)
    private readonly interactionRepo: Repository<Interaction>,
    @InjectRepository(CRMCustomer)
    private readonly customerRepo: Repository<CRMCustomer>,
  ) {}

  async create(dto: CreateInteractionDto) {
    const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const interaction = this.interactionRepo.create({
      ...dto,
      customer,
    });

    return this.interactionRepo.save(interaction);
  }

  findAll() {
    return this.interactionRepo.find({ relations: ['customer'] });
  }

  async findOne(id: string) {
    const interaction = await this.interactionRepo.findOne({ where: { id }, relations: ['customer'] });
    if (!interaction) throw new NotFoundException('Interaction not found');
    return interaction;
  }

  async remove(id: string) {
    const interaction = await this.findOne(id);
    return this.interactionRepo.remove(interaction);
  }
}
