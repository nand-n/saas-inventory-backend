import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Plan[]> {
    return this.planRepository.find();
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async findFreePlan ():Promise<Plan> {
    const freePlan = await this.planRepository.findOne({
      where:{
        isFree:true
      }
    })
    if (!freePlan) {
      throw new NotFoundException(`No free plan found`);
    }
    return freePlan;

  }

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = this.planRepository.create(createPlanDto);
    return this.planRepository.save(plan);
  }

  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    await this.findOne(id);
    await this.planRepository.update(id, updatePlanDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);
    await this.planRepository.remove(plan);
  }
}
