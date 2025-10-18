import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { CreateOpportunityDto } from './dtos/create-opportunity.dto';

@Controller('crm/opportunities')
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Post()
  create(@Body() dto: CreateOpportunityDto) {
    return this.opportunityService.create(dto);
  }

  @Get()
  findAll() {
    return this.opportunityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.opportunityService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateOpportunityDto>) {
    return this.opportunityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opportunityService.remove(id);
  }
}
