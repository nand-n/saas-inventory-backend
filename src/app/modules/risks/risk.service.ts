import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, Like } from 'typeorm';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { Risk } from './entities/risks.entity';

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(Risk)
    private readonly riskRepository: Repository<Risk>,
  ) {}

  async create(dto: CreateRiskDto): Promise<Risk> {
    const risk = this.riskRepository.create({
      ...dto,
      riskScore: dto.riskScore ?? (dto.likelihood ?? 0) * (dto.impact ?? 0),
    });
    return this.riskRepository.save(risk);
  }

  async findAll(filters?: any): Promise<Risk[]> {
    const where: any = {};

    if (filters?.search)
      where.title = Like(`%${filters.search}%`);

    if (filters?.severity)
      where.severity = Array.isArray(filters.severity)
        ? In(filters.severity)
        : filters.severity;

    if (filters?.status)
      where.status = Array.isArray(filters.status)
        ? In(filters.status)
        : filters.status;

    if (filters?.branchId) where.branchId = filters.branchId;
    if (filters?.shipmentId) where.shipmentId = filters.shipmentId;

    if (filters?.createdFrom && filters?.createdTo)
      where.createdAt = Between(filters.createdFrom, filters.createdTo);

    return this.riskRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Risk> {
    const risk = await this.riskRepository.findOne({ where: { id } });
    if (!risk) throw new NotFoundException('Risk not found');
    return risk;
  }

  async update(id: string, dto: UpdateRiskDto): Promise<Risk> {
    const risk = await this.findOne(id);
    Object.assign(risk, {
      ...dto,
      riskScore: dto.riskScore ?? (dto.likelihood ?? risk.likelihood) * (dto.impact ?? risk.impact),
    });
    return this.riskRepository.save(risk);
  }

  async remove(id: string): Promise<void> {
    const risk = await this.findOne(id);
    await this.riskRepository.remove(risk);
  }
}
