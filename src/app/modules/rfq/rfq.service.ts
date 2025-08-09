import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from '../supliers/entities/suplier.entity';
import { RFQ } from './entities/rfq.entity';
import { CreateRFQDto } from './dtos/create-rfq.dto';
import { UpdateRFQDto } from './dtos/update-rfq.dto';

@Injectable()
export class RFQService {
  constructor(
    @InjectRepository(RFQ)
    private readonly rfqRepository: Repository<RFQ>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createRfqDto: CreateRFQDto): Promise<RFQ> {
  const rfqNumber = `RFQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;


    const rfq = this.rfqRepository.create({...createRfqDto , rfqNumber});

    if (createRfqDto.supplierId) {
      const supplier = await this.supplierRepository.findOneBy({ id: createRfqDto.supplierId });
      if (!supplier) throw new NotFoundException('Supplier not found');
      rfq.supplier = supplier;
    }

    return this.rfqRepository.save(rfq);
  }

  async findAll(): Promise<RFQ[]> {
    return this.rfqRepository.find({ relations: ['supplier', 'items'] });
  }

  async findOne(id: string): Promise<RFQ> {
    const rfq = await this.rfqRepository.findOne({
      where: { id },
      relations: ['supplier', 'items']
    });
    if (!rfq) throw new NotFoundException('RFQ not found');
    return rfq;
  }

  async update(id: string, updateRfqDto: UpdateRFQDto): Promise<RFQ> {
    const rfq = await this.findOne(id);

    if (updateRfqDto.supplierId) {
      const supplier = await this.supplierRepository.findOneBy({ id: updateRfqDto.supplierId });
      if (!supplier) throw new NotFoundException('Supplier not found');
      rfq.supplier = supplier;
    }

    Object.assign(rfq, updateRfqDto);
    return this.rfqRepository.save(rfq);
  }

  async remove(id: string): Promise<void> {
    const rfq = await this.findOne(id);
    await this.rfqRepository.remove(rfq);
  }
}
