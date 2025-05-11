import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { InvoiceService } from '../invoice/invoice.service';
import { CreateInvoiceDto } from '../invoice/dto/create-invoice.dto';
import { InvoiceStatus } from '../invoice/enums/invoice-status.enum';
import { PaymentMethodService } from '../payment-method/payment-method.service';
import { PlanService } from '../plan/plan.service';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    private readonly invoiceService: InvoiceService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly planService:PlanService,
    private readonly userService:UsersService,
    private readonly tenantService:TenantsService
  ) {}

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepository.find({ relations: ['plan', 'invoice', 'paymentMethod'] });
  }

  async findOne(id: string): Promise<SubscriptionPlan> {
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id }, relations: ['plan', 'invoice', 'paymentMethod'] });
    if (!subscriptionPlan) {
      throw new NotFoundException(`Subscription Plan with ID ${id} not found`);
    }
    return subscriptionPlan;
  }


  async getUserActiveSubscription(user_id:string){
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { tenant_admin_user_id:user_id , is_active:true}, relations: ['plan', 'invoice', 'paymentMethod'] });
    if (!subscriptionPlan) {
      throw new NotFoundException(`Subscription Plan with ID ${user_id} not found`);
    }
    return subscriptionPlan;
  }


  async geTenantActiveSubscription(tenant_id:string){
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { tenant_id:tenant_id , is_active:true}, relations: ['plan', 'invoice', 'paymentMethod'] });
    if (!subscriptionPlan) {
      throw new NotFoundException(`Subscription Plan with ID ${tenant_id} not found`);
    }
    return subscriptionPlan;
  }

  async create(createSubscriptionPlanDto: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> {
    const paymentMethod = await this.paymentMethodService.findOne(createSubscriptionPlanDto.payment_method_id)
    const plan  = await this.planService.findOne(createSubscriptionPlanDto.plan_id)
    const tenant  = await this.tenantService.findOne(createSubscriptionPlanDto.tenant_id)
    if(!tenant){
      throw new Error("Tenant Not found!")
    }

    const createInvoiceDto: CreateInvoiceDto = {
      amount: plan.current_price,  
      status: InvoiceStatus.UNPAID,
      currency:paymentMethod.currencyCode,
    };

    const createdInvoice = await this.invoiceService.create(createInvoiceDto)
    if(!createdInvoice)  throw new  Error("Error creating invoice")

      const user  = await this.userService.findById(createSubscriptionPlanDto.user_id)
    if(!user) throw new Error("User not found")

    const subscriptionPlan = this.subscriptionPlanRepository.create({
      ...createSubscriptionPlanDto, 
      paymentMethod,
      invoice:createdInvoice,
      plan
    });
    const createdSubscritpionPlan = await this.subscriptionPlanRepository.save(subscriptionPlan)

    const tenantWithSubscription = await this.tenantService.attachSubscriptionToTenant(createdSubscritpionPlan)
    if(!tenantWithSubscription) {
      throw new Error("Failed to attach the subscriptoin with Tenant!")
    }
    return createdSubscritpionPlan ;
  }

  async update(id: string, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto): Promise<SubscriptionPlan> {
    await this.findOne(id);
    await this.subscriptionPlanRepository.update(id, updateSubscriptionPlanDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const subscriptionPlan = await this.findOne(id);
    await this.subscriptionPlanRepository.remove(subscriptionPlan);
  }

  async updateIsPayed(id: string): Promise<SubscriptionPlan> {
    const subscriptinPlan = await this.subscriptionPlanRepository.findOne({ where: { id } });
    if (!subscriptinPlan) {
      throw new NotFoundException('Subscriptin Plan not found');
    }

    subscriptinPlan.isPayed = true;
    subscriptinPlan.is_active = true;

    return this.subscriptionPlanRepository.save(subscriptinPlan);
  }
}
