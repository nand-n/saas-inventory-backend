import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('payment-methods')
@ApiTags("Payment Methods")
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  async findAll(): Promise<PaymentMethod[]> {
    return await this.paymentMethodService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentMethod> {
    return this.paymentMethodService.findOne(id);
  }

  @Post()
  async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    return this.paymentMethodService.create(createPaymentMethodDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    return this.paymentMethodService.update(id, updatePaymentMethodDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.paymentMethodService.remove(id);
  }
}
