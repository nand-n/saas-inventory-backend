import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { Payroll } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly service: PayrollsService) {}

  @Post()
  create(@Body() dto: CreatePayrollDto): Promise<Payroll> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<Payroll[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Payroll> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePayrollDto): Promise<Payroll> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
