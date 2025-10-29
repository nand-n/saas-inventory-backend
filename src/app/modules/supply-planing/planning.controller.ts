import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { PlanningService } from './palling.service';
import { CreatePlanningDto } from './dtos/create-planning.dto';
import { UpdatePlanningDto } from './dtos/update-planning.dto';
import { ApprovePlanningDto } from './dtos/approve-planning.dto';


@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  create(@Body() dto: CreatePlanningDto) {
    return this.planningService.create(dto);
  }

  @Get()
  findAll() {
    return this.planningService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planningService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlanningDto) {
    return this.planningService.update(id, dto);
  }

  @Post(':id/request-approval')
  requestApproval(@Param('id') id: string) {
    return this.planningService.requestApproval(id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body() dto: ApprovePlanningDto) {
    return this.planningService.approve(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planningService.remove(id);
  }
}
