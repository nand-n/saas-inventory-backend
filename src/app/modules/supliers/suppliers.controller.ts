import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/suplier.entity';
import { PaginationDto } from 'src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) { }

  @Post()
  create(@Body() dto: CreateSupplierDto): Promise<Supplier> {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<Pagination<Supplier>> {
    return this.service.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Supplier> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}