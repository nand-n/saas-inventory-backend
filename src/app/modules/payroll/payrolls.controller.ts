import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { Payroll } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import {  CreatePayrollAdjustmentDto } from './dto/create-payroll-adjestime.dto';
import { PayrollAdjustment } from './entities/payroll-adjestment.entity';
import { PayrollAdjustmentsService } from './payroll-adjustments.service';
import { PayrollRunService } from './payroll-run.service';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { PayrollRun, PayrollRunStatus } from './entities/payroll-run.entity';
import { UpdatePayrollRunDto } from './dto/update-payroll-run.dto';

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly service: PayrollsService , 
    private readonly adjustmentsService: PayrollAdjustmentsService,
    private readonly payrollRunService: PayrollRunService,

  ) {}

  @Post()
  create(@Body() dto: CreatePayrollDto): Promise<Payroll> {
    return this.service.create(dto);
  }

    @Post('bulk-delete')
bulkRemove(@Body() body: { ids: string[] }): Promise<void> {
  return this.service.bulkRemove(body.ids);
}
   @Post('run')
  createRun(@Body() dto: CreatePayrollRunDto): Promise<PayrollRun> {
    return this.payrollRunService.create(dto);
  }

     @Post('run/:id/update')
  updateRun(
      @Param('id') id: string,
    @Body() dto: UpdatePayrollRunDto): Promise<PayrollRun> {
    return this.payrollRunService.update( id,dto);
  }

  @Patch('run/:id/status')
async updatePayrollRunStatus(
  @Param('id') id: string,
  @Body() body: { status: PayrollRunStatus },Z
): Promise<PayrollRun> {
  return this.payrollRunService.updateStatus(id, body.status);
}

  @Get()
  findAll(): Promise<Payroll[]> {
    return this.service.findAll();
  }

   @Get('run')
  getPayrollRuns(): Promise<PayrollRun[]> {
    return  this.payrollRunService.findAll();
  }


  @Get('adjustments')
  getPayrollAdjestments(): Promise<PayrollAdjustment[]> {
    return  this.adjustmentsService.findAll();
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
  @Post('adjustments/:payrollId')
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

