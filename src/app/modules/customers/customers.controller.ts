import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { PaginationDto } from 'src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Customer } from './entities/customers.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) { }

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<Pagination<Customer>> {
    return this.service.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
