import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shipment } from '../../shipment/entities/shipment.entity';
import { Branch } from '../../branchs/entities/branch.entity';
import { BaseModel } from '@root/src/database/base.model';

export enum RiskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum RiskStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  MITIGATED = 'mitigated',
  CLOSED = 'closed',
}

@Entity('risks')
export class Risk extends BaseModel {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'enum', enum: RiskSeverity, default: RiskSeverity.LOW })
  severity: RiskSeverity;

  @Column({ type: 'float', default: 0 })
  likelihood: number;

  @Column({ type: 'float', default: 0 })
  impact: number;

  @Column({ type: 'float', nullable: true })
  riskScore?: number | null;

  @Column({ type: 'enum', enum: RiskStatus, default: RiskStatus.OPEN })
  status: RiskStatus;

  @Column({ nullable: true })
  branchId?: string | null;

  @Column({ nullable: true })
  shipmentId?: string | null;

  @Column({ type: 'text', nullable: true })
  mitigationPlan?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date | null;


  @ManyToOne(() => Branch, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'branchId' })
  branch?: Branch;

  @ManyToOne(() => Shipment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'shipmentId' })
  shipment?: Shipment;
}
