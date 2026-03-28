import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly repo: Repository<Shipment>,
  ) { }

  async create(dto: CreateShipmentDto): Promise<Shipment> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll(): Promise<Shipment[]> {
    return this.repo.find({ relations: ['order', 'supplier', 'customsDocuments'] });
  }

  async findOne(id: string): Promise<Shipment> {
    const shipment = await this.repo.findOne({ where: { id }, relations: ['order', 'supplier', 'customsDocuments'] });
    if (!shipment) throw new NotFoundException(`Shipment #${id} not found`);
    return shipment;
  }

  async update(id: string, dto: UpdateShipmentDto): Promise<Shipment> {
    const shipment = await this.findOne(id);
    Object.assign(shipment, dto);
    return this.repo.save(shipment);
  }

  async remove(id: string): Promise<void> {
    const shipment = await this.findOne(id);
    await this.repo.remove(shipment);
  }

  async count() {
    return this.repo.count();
  }
}
