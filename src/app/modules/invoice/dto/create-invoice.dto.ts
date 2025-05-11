import { IsInt, IsEnum, Min, IsString, IsNumber } from 'class-validator';
import { InvoiceStatus } from '../enums/invoice-status.enum';

export class CreateInvoiceDto {

  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @IsNumber()
  @Min(0)
  amount: number;
  
  @IsString()
  currency:string
}
