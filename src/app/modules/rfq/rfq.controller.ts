import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RFQService } from './rfq.service';
import { CreateRFQDto } from './dtos/create-rfq.dto';
import { UpdateRFQDto } from './dtos/update-rfq.dto';

@Controller('rfqs')
export class RFQController {
  constructor(private readonly rfqService: RFQService) {}

  @Post()
  create(@Body() createRfqDto: CreateRFQDto) {
    return this.rfqService.create(createRfqDto);
  }

  @Get()
  findAll() {
    return this.rfqService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rfqService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRfqDto: UpdateRFQDto) {
    return this.rfqService.update(id, updateRfqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rfqService.remove(id);
  }
}
