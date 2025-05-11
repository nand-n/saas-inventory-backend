import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('subscription-plans')
@ApiTags("Subscription-plans")
export class SubscriptionPlanController {
  constructor(private readonly subscriptionPlanService: SubscriptionPlanService) {}

  @Get()
  async findAll(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanService.findAll();
  }
  @Get('tenant/:tenant_id')
  async geActiveTenantSubscription(@Param('tenant_id', ParseUUIDPipe) tenant_id: string): Promise<SubscriptionPlan> {
    return this.subscriptionPlanService.geTenantActiveSubscription(tenant_id);
  }

  
  @Get('user/:user_id')
  async getUserActiveSubscription(@Param('user_id', ParseUUIDPipe) user_id: string): Promise<SubscriptionPlan> {
    return this.subscriptionPlanService.getUserActiveSubscription(user_id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SubscriptionPlan> {
    return this.subscriptionPlanService.findOne(id);
  }

  @Post()
  async create(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> {
    return this.subscriptionPlanService.create(createSubscriptionPlanDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    return this.subscriptionPlanService.update(id, updateSubscriptionPlanDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.subscriptionPlanService.remove(id);
  }
}
