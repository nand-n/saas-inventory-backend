import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { Payroll } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import {  CreatePayrollAdjustmentDto } from './dto/create-payroll-adjestime.dto';
import { PayrollAdjustment } from './entities/payroll-adjestment.entity';
import { PayrollAdjustmentsService } from './payroll-adjustments.service';

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly service: PayrollsService , 
    private readonly adjustmentsService: PayrollAdjustmentsService,
  ) {}

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

  // ---------------- Payroll Adjustment Endpoints ----------------

  /**
   * ➕➖ Create a payroll adjustment (addition or deduction)
   */
  @Post(':payrollId/adjustments')
  async createAdjustment(
    @Param('payrollId') payrollId: string,
    @Body() dto: CreatePayrollAdjustmentDto,
  ): Promise<PayrollAdjustment> {
    dto.payrollId = payrollId;
    return this.adjustmentsService.create(dto);
  }

  /**
   * 💰 Settle (pay/disburse) an adjustment
   */
  @Post('adjustments/:adjustmentId/settle')
  async settleAdjustment(
    @Param('adjustmentId') adjustmentId: string,
  ): Promise<PayrollAdjustment> {
    return this.adjustmentsService.settleAdjustment(adjustmentId);
  }

  /**
   * 📋 List all adjustments (optionally filter by payroll)
   */
  @Get(':payrollId/adjustments')
  async findAdjustments(
    @Param('payrollId') payrollId: string,
  ): Promise<PayrollAdjustment[]> {
    const all = await this.adjustmentsService.findAll();
    return all.filter((adj) => adj.payroll?.id === payrollId);
  }
}

