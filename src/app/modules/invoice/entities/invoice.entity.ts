import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column } from 'typeorm';
import { InvoiceStatus } from '../enums/invoice-status.enum';

@Entity()
export class Invoice extends BaseModel {

  @Column({ type: 'int' })
  invoice_number: number;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
  status: InvoiceStatus;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'varchar' })
  currency: string;
}
