import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Rfi } from './rfi.entity';

@Entity('rfi_questions')
export class RfiQuestion extends BaseModel {
  @ManyToOne(() => Rfi, (rfi) => rfi.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rfi_id' })
  rfi: Rfi;

  @Column()
  question: string;

  @Column({ nullable: true })
  responseType?: 'TEXT' | 'NUMBER' | 'MULTIPLE_CHOICE';

  @Column({ type: 'jsonb', nullable: true })
  options?: string[];

  @Column({ nullable: true })
  order?: number;
}
