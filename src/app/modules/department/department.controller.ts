import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly deptService: DepartmentService) {}

  @Post()
  create(@Body() dto: CreateDepartmentDto) {
    return this.deptService.create(dto);
  }


  @Get('tenant/:tenantId')
findByTenant(@Param('tenantId') tenantId: string) {
  return this.deptService.findDepartmentsPerTenant(tenantId);
}
  @Get()
  findAll() {
    return this.deptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deptService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.deptService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deptService.remove(id);
  }
}
