import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async findAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find()
  }

  async findOne(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id } });
    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }
    return paymentMethod;
  }

  async findFree(): Promise<PaymentMethod> {
    const freePaymentMethod = await this.paymentMethodRepository.findOne({ where: {isFree:true } });
    if (!freePaymentMethod) {
      throw new NotFoundException(`No Free Payment method found!`);
    }
    return freePaymentMethod;
  }

  async create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);
    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    await this.findOne(id); // Ensure the payment method exists
    await this.paymentMethodRepository.update(id, updatePaymentMethodDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const paymentMethod = await this.findOne(id);
    await this.paymentMethodRepository.remove(paymentMethod);
  }
}
