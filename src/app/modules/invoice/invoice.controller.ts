import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('invoices')
@ApiTags('Invoices') 

export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async findAll(): Promise<Invoice[]> {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.invoiceService.remove(id);
  }
}
