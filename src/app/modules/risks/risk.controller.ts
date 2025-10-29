import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RiskService } from './risk.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';

@Controller('risks')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Post()
  create(@Body() dto: CreateRiskDto) {
    return this.riskService.create(dto);
  }

  @Get()
  findAll(@Query() filters: any) {
    return this.riskService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.riskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRiskDto) {
    return this.riskService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.riskService.remove(id);
  }
}
