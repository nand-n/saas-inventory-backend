import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RFQService } from './rfq.service';
import { CreateRFQDto } from './dtos/create-rfq.dto';
import { UpdateRFQDto } from './dtos/update-rfq.dto';

@Controller('rfqs')
export class RFQController {
  constructor(private readonly rfqService: RFQService) { }

  @Post()
  create(@Body() createRfqDto: CreateRFQDto) {
    return this.rfqService.create(createRfqDto);
  }

  @Post(':id/send')
  sendRFQ(@Param('id') id: string) {
    return this.rfqService.sendRFQ(id);
  }

  @Post(':id/bid/:supplierId')
  submitBid(@Param('id') rfqId: string, @Param('supplierId') supplierId: string, @Body() itemsBid: any[]) {
    return this.rfqService.submitBid(rfqId, supplierId, itemsBid);
  }

  @Post(':id/award/:supplierId')
  awardItems(@Param('id') rfqId: string, @Param('supplierId') supplierId: string, @Body('itemIds') itemIds: string[]) {
    return this.rfqService.awardItems(rfqId, supplierId, itemIds);
  }

  @Post(':id/generate-po')
  generatePO(@Param('id') id: string) {
    return this.rfqService.generatePO(id);
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
