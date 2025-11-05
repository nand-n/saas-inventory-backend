import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { User } from '../../users/entities/user.entity';
import { RfiQuestion } from './rfi-question.entity';

@Entity('rfis')
export class Rfi extends BaseModel {
  // Example: RFI-2025-001
  @Column({ unique: true })
  referenceNumber: string;

  @Column()
  title: string;

  // ---------------------------------------------------
  // 📘 1. Introduction Section
  // ---------------------------------------------------
  @Column({ type: 'text', nullable: true })
  introduction?: string;

  // ---------------------------------------------------
  // 🎯 2. Purpose of the RFI
  // ---------------------------------------------------
  @Column({ type: 'text', nullable: true })
  purpose?: string;

  // ---------------------------------------------------
  // 🏢 3. Background of the Company/Project
  // ---------------------------------------------------
  @Column({ type: 'text', nullable: true })
  background?: string;

  // ---------------------------------------------------
  // 🧠 4. Scope of Information Requested
  // ---------------------------------------------------
  @Column({ type: 'text', nullable: true })
  scopeOfInformation?: string;

  // ---------------------------------------------------
  // ❓ 5. Questions to Suppliers
  // ---------------------------------------------------
  @OneToMany(() => RfiQuestion, (q) => q.rfi, { cascade: true })
  questions: RfiQuestion[];

  // ---------------------------------------------------
  // 📦 6. Response Format (How vendors should reply)
  // ---------------------------------------------------
  @Column({ type: 'text', nullable: true })
  responseFormat?: string;

  // ---------------------------------------------------
  // ⏰ 7. Timeline (submission, clarification, next steps)
  // ---------------------------------------------------
  @Column({ type: 'timestamp', nullable: true })
  issueDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  submissionDeadline?: Date;

  @Column({ type: 'text', nullable: true })
  nextSteps?: string;

  // ---------------------------------------------------
  // 🔒 8. Confidentiality Notice
  // ---------------------------------------------------
  @Column({ type: 'text', nullable: true })
  confidentialityNotice?: string;

  // ---------------------------------------------------
  // 📎 Other useful metadata
  // ---------------------------------------------------
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({
    type: 'enum',
    enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
    default: 'DRAFT',
  })
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';

  @Column({ type: 'jsonb', nullable: true })
  attachments?: { name: string; url: string }[];

  @Column({ type: 'text', nullable: true })
  remarks?: string;
}
