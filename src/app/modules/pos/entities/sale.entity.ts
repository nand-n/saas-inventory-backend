import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { SaleLine } from './sale-line.entity';

@Entity()
export class Sale extends BaseModel {
  @Column()
  tenantId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @OneToMany(() => SaleLine, (line) => line.sale, {
    cascade: true,
    eager: true,
  })
  lines: SaleLine[];
}
