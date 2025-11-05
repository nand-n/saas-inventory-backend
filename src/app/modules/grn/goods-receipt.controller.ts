import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GoodsReceiptService } from './goods-receipt.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoodsReceipt, GoodsReceiptStatus, GRNQCStatus } from './entities/grn.entity';
import { CreateGoodsReceiptDto } from './dtos/create-grn.dto';
import { UpdateGoodsReceiptDto } from './dtos/update-grn.dto';

@ApiTags('Goods Receipts')
@Controller('goods-receipts')
export class GoodsReceiptController {
  constructor(private readonly grnService: GoodsReceiptService) {}

  // ---------- Basic CRUD ----------
  @Post()
  @ApiOperation({ summary: 'Create a goods receipt' })
  @ApiResponse({ status: 201, type: GoodsReceipt })
  async create(@Body() dto: CreateGoodsReceiptDto) {
    return this.grnService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all goods receipts' })
  async findAll() {
    return this.grnService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get goods receipt by ID' })
  async findOne(@Param('id') id: string) {
    return this.grnService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update goods receipt' })
  async update(@Param('id') id: string, @Body() dto: UpdateGoodsReceiptDto) {
    return this.grnService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete goods receipt' })
  async remove(@Param('id') id: string) {
    return this.grnService.remove(id);
  }

  // ---------- Approval / Workflow ----------
  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve a goods receipt' })
  async approve(@Param('id') id: string) {
    return this.grnService.approve(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a goods receipt' })
  async reject(@Param('id') id: string) {
    return this.grnService.reject(id);
  }

  // ---------- Quality Control ----------
  @Patch(':id/qc')
  @ApiOperation({ summary: 'Update QC status and remarks for a GRN' })
  async updateQC(@Param('id') id: string, @Body() qcDto: { qcStatus:GRNQCStatus ; qcRemarks?: string }) {
    return this.grnService.updateQC(id, qcDto.qcStatus, qcDto.qcRemarks);
  }

  // ---------- Partial Receipt / Quantity Adjustment ----------
  @Patch(':id/adjust-quantities')
  @ApiOperation({ summary: 'Adjust quantities for partial deliveries' })
  async adjustQuantities(@Param('id') id: string, @Body() adjustments: { itemId: string; receivedQuantity: number }[]) {
    return this.grnService.adjustQuantities(id, adjustments);
  }

  // ---------- Shipment / Supplier Info ----------
  @Patch(':id/shipment')
  @ApiOperation({ summary: 'Update shipment or supplier delivery details' })
  async updateShipment(@Param('id') id: string, @Body() shipmentDto: { carrier?: string; trackingNumber?: string; deliveryDate?: string }) {
    return this.grnService.updateShipment(id, shipmentDto);
  }

  // ---------- Audit / History ----------
  @Get(':id/history')
  @ApiOperation({ summary: 'Get action history of a goods receipt' })
  async getHistory(@Param('id') id: string) {
    return this.grnService.getHistory(id);
  }

  // ---------- Reporting / Filtering ----------
  @Get('filter')
  @ApiOperation({ summary: 'Filter goods receipts by status, warehouse, or supplier' })
  async filter(@Body() filterDto: { status?: string; warehouse?: string; supplierId?: string }) {
    return this.grnService.filter(filterDto);
  }
}
