import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { JournalLine } from './journal-line.entity';
import { Tenant } from '../../tenants/entities/tenants.entity';

@Entity()
export class Journal extends BaseModel {
  @Column()
  date: Date;

  @Column()
  description: string;

  @OneToMany(() => JournalLine, (line) => line.journal, { cascade: true })
  lines: JournalLine[];

  @ManyToOne(() => Tenant, { eager: true })
  tenant: Tenant;
}
