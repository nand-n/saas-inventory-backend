// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import {  Planning, PlanningStatus } from './entities/planning.entity';
// import { CreatePlanningDto } from './dtos/create-planning.dto';
// import { UpdatePlanningDto } from './dtos/update-planning.dto';
// import { ApprovePlanningDto } from './dtos/approve-planning.dto';


// @Injectable()
// export class PlanningService {
//   constructor(
//     @InjectRepository(Planning)
//     private readonly planningRepo: Repository<Planning>,
//   ) {}

//   // Create Draft
//   async create(dto: CreatePlanningDto): Promise<Planning> {
//     const plan = this.planningRepo.create({
//       ...dto,
//       status: PlanningStatus.DRAFT,
//     });
//     return this.planningRepo.save(plan);
//   }

//   // Get all plans
//   findAll(): Promise<Planning[]> {
//     return this.planningRepo.find({ order: { createdAt: 'DESC' } });
//   }

//   // Get one plan
//   async findOne(id: string): Promise<Planning> {
//     const plan = await this.planningRepo.findOne({ where: { id } });
//     if (!plan) throw new NotFoundException('Planning record not found');
//     return plan;
//   }

//   // Update plan details (only if still draft)
//   async update(id: string, dto: UpdatePlanningDto): Promise<Planning> {
//     const plan = await this.findOne(id);
//     if (plan.status !== PlanningStatus.DRAFT) {
//       throw new BadRequestException('Only DRAFT plans can be updated');
//     }

//     Object.assign(plan, dto);
//     return this.planningRepo.save(plan);
//   }

//   // Run calculation and request approval
//   async requestApproval(id: string): Promise<Planning> {
//   const plan = await this.findOne(id);

//   if (plan.status !== PlanningStatus.DRAFT) {
//     throw new BadRequestException('Only DRAFT plans can request approval');
//   }

//   // ------------------------------
//   // Heuristic calculations
//   // ------------------------------
//   const totalDemand = plan.forecastMonthlyDemand * plan.forecastHorizonMonths;
//   const weeklyDemand = Math.round(plan.forecastMonthlyDemand / 4);
//   const safetyStock = Math.round(weeklyDemand * plan.safetyFactor);
//   const rawOrderQuantity = totalDemand - plan.currentOnHand + safetyStock;

//   let orderQuantityRounded = rawOrderQuantity;
//   if (plan.moq) {
//     orderQuantityRounded = Math.max(orderQuantityRounded, plan.moq);
//   }
//   if (plan.packagingMultiple) {
//     orderQuantityRounded =
//       Math.ceil(orderQuantityRounded / plan.packagingMultiple) *
//       plan.packagingMultiple;
//   }

//   plan.totalDemand = totalDemand;
//   plan.weeklyDemand = weeklyDemand;
//   plan.safetyStock = safetyStock;
//   plan.rawOrderQuantity = rawOrderQuantity;
//   plan.orderQuantityRounded = orderQuantityRounded;
//   plan.decidedOrderQuantity = orderQuantityRounded;
//   plan.plannedShipmentBatches = 2;
//   plan.perBatchQuantity = Math.round(orderQuantityRounded / 2);
//   plan.status = PlanningStatus.REQUESTED;
//   // plan.approvalRequestedBy = requestedBy;
//   plan.approvalRequestedAt = new Date();

//   return this.planningRepo.save(plan);
// }


//   // Approve or Reject
//   async approve(id: string, dto: ApprovePlanningDto): Promise<Planning> {
//     const plan = await this.findOne(id);
//     if (plan.status !== PlanningStatus.REQUESTED) {
//       throw new BadRequestException('Only REQUESTED plans can be approved or rejected');
//     }

//     plan.status = dto.status;
//     plan.approvedBy = dto.approvedBy;
//     plan.approvedAt = new Date();
//     plan.approvalRemarks = dto.approvalRemarks;

//     return this.planningRepo.save(plan);
//   }

//   // Delete (optional)
//   async remove(id: string): Promise<void> {
//     await this.planningRepo.delete(id);
//   }
// }


import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning, PlanningStatus } from './entities/planning.entity';
import { CreatePlanningDto } from './dtos/create-planning.dto';
import { UpdatePlanningDto } from './dtos/update-planning.dto';
import { ApprovePlanningDto } from './dtos/approve-planning.dto';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private readonly planningRepo: Repository<Planning>,
  ) {}

  // -----------------------------
  // Create Draft
  // -----------------------------
  async create(dto: CreatePlanningDto): Promise<Planning> {
    const plan = this.planningRepo.create({
      ...dto,
      status: PlanningStatus.DRAFT,
    });
    return this.planningRepo.save(plan);
  }

  // -----------------------------
  // Get all
  // -----------------------------
  findAll(): Promise<Planning[]> {
    return this.planningRepo.find({ order: { createdAt: 'DESC' } });
  }

  // -----------------------------
  // Get one
  // -----------------------------
  async findOne(id: string): Promise<Planning> {
    const plan = await this.planningRepo.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Planning record not found');
    return plan;
  }

  // -----------------------------
  // Update (only if DRAFT)
  // -----------------------------
  async update(id: string, dto: UpdatePlanningDto): Promise<Planning> {
    const plan = await this.findOne(id);
    if (plan.status !== PlanningStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT plans can be updated');
    }
    Object.assign(plan, dto);
    return this.planningRepo.save(plan);
  }

  // -----------------------------
  // Request Approval
  // -----------------------------
  async requestApproval(id: string): Promise<Planning> {
    const plan = await this.findOne(id);
    if (plan.status !== PlanningStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT plans can request approval');
    }

    // 🔹 Heuristic calculations
    const totalDemand = (plan.forecastMonthlyDemand ?? 0) * (plan.forecastHorizonMonths ?? 1);
    const weeklyDemand = Math.round((plan.forecastMonthlyDemand ?? 0) / 4);
    const safetyFactor = plan.safetyFactor ?? 1;
    const safetyStock = Math.round(weeklyDemand * safetyFactor);
    const rawOrderQuantity = totalDemand - (plan.currentOnHand ?? 0) + safetyStock;

    let orderQuantityRounded = rawOrderQuantity;
    if (plan.moq) orderQuantityRounded = Math.max(orderQuantityRounded, plan.moq);
    if (plan.packagingMultiple)
      orderQuantityRounded =
        Math.ceil(orderQuantityRounded / plan.packagingMultiple) * plan.packagingMultiple;

    plan.totalDemand = totalDemand;
    plan.weeklyDemand = weeklyDemand;
    plan.safetyStock = safetyStock;
    plan.rawOrderQuantity = rawOrderQuantity;
    plan.orderQuantityRounded = orderQuantityRounded;
    plan.decidedOrderQuantity = orderQuantityRounded;
    plan.plannedShipmentBatches = 2;
    plan.perBatchQuantity = Math.round(orderQuantityRounded / 2);
    plan.status = PlanningStatus.REQUESTED;
    plan.approvalRequestedAt = new Date();

    return this.planningRepo.save(plan);
  }

  // -----------------------------
  // Approve / Reject
  // -----------------------------
  async approve(id: string, dto: ApprovePlanningDto): Promise<Planning> {
    const plan = await this.findOne(id);
    if (plan.status !== PlanningStatus.REQUESTED) {
      throw new BadRequestException('Only REQUESTED plans can be approved or rejected');
    }

    plan.status = dto.status;
    plan.approvedBy = dto.approvedBy;
    plan.approvedAt = new Date();
    plan.approvalRemarks = dto.approvalRemarks;

    return this.planningRepo.save(plan);
  }

  // -----------------------------
  // Delete
  // -----------------------------
  async remove(id: string): Promise<void> {
    await this.planningRepo.delete(id);
  }
}
