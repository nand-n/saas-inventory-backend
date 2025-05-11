import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { ApiTags } from '@nestjs/swagger';
import { ExcludeAuthGuard, ExcludeSubscriptionGuard } from '@root/src/core/guards/excludeTenant.guard';

@Controller('plans')
@ApiTags("Plans")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
@ExcludeAuthGuard()
@ExcludeSubscriptionGuard()
  async findAll(): Promise<Plan[]> {
    return this.planService.findAll();
  }

  @Get(':id')
  @ExcludeAuthGuard()
  @ExcludeSubscriptionGuard()
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Plan> {
    return this.planService.findOne(id);
  }

  @Post()
  async create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.planService.create(createPlanDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<Plan> {
    return this.planService.update(id, updatePlanDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.planService.remove(id);
  }
}
