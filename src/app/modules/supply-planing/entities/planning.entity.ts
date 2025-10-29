import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column, Index } from 'typeorm';

export enum PlanningStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}


@Entity('planning')
export class Planning extends BaseModel {
  @Index()
  @Column({ type: 'varchar', length: 150 })
  name: string;
  // -----------------------------
  // 🔹 SUPPLY PLANNING SECTION
  // -----------------------------
  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  forecastMonthlyDemand?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  forecastHorizonMonths?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  currentOnHand?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  leadTimeWeeks?: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  desiredServiceLevel?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  shelfLifeMonths?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  minRemainingShelfLifeMonths?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  moq?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  packagingMultiple?: number;

  @Column('decimal', { precision: 4, scale: 2, nullable: true })
  safetyFactor?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  totalDemand?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  weeklyDemand?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  safetyStock?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  rawOrderQuantity?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  orderQuantityRounded?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  decidedOrderQuantity?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })
  plannedShipmentBatches?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true })

  perBatchQuantity?: number;

  // -----------------------------
  // 🔹 RESOURCE PLANNING SECTION
  // -----------------------------
  @Column('jsonb', { nullable: true })
  resources?: {
    manpower?: number;
    equipment?: string[];
    budget?: number;
    departmentsInvolved?: string[];
  };

  // -----------------------------
  // 🔹 TIME PLANNING SECTION
  // -----------------------------
  @Column('jsonb', { nullable: true })
  timeline?: {
    startDate?: Date;
    endDate?: Date;
    milestones?: {
      name: string;
      targetDate: Date;
      status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    }[];
  };

  // -----------------------------
  // 🔹 CAPACITY PLANNING SECTION
  // -----------------------------
  @Column('jsonb', { nullable: true })
  capacity?: {
    productionLines?: number;
    maxOutputPerDay?: number;
    currentUtilization?: number;
    bottlenecks?: string[];
  };

  // -----------------------------
  // 🔹 APPROVAL & WORKFLOW
  // -----------------------------
  @Column({ type: 'enum', enum: PlanningStatus, default: PlanningStatus.DRAFT })
  status: PlanningStatus;

  @Column({ type: 'varchar', length: 120, nullable: true })
  approvalRequestedBy?: string;

  @Column({ type: 'timestamptz', nullable: true })
  approvalRequestedAt?: Date;

  @Column({ type: 'varchar', length: 120, nullable: true })
  approvedBy?: string;

  @Column({ type: 'timestamptz', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'text', nullable: true })
  approvalRemarks?: string;
}
