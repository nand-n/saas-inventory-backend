import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice_number = Math.floor(1000 + Math.random() * 9000);
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      invoice_number,
    });

    return await this.invoiceRepository.save(invoice);
  }
  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    await this.findOne(id); 
    await this.invoiceRepository.update(id, updateInvoiceDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }
}
