import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CRMCustomer } from './customer/entities/customer.entity';
import { Opportunity } from './opportunity/entities/opportunity.entity';
import { Interaction } from './interaction/entities/interaction.entity';
import { CustomerService } from './customer/customer.service';
import { OpportunityService } from './opportunity/opportunity.service';
import { InteractionService } from './interaction/interaction.service';
import { CustomerController } from './customer/customer.controller';
import { OpportunityController } from './opportunity/opportunity.controller';
import { InteractionController } from './interaction/interaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CRMCustomer, Opportunity, Interaction])],
  controllers: [CustomerController, OpportunityController, InteractionController],
  providers: [CustomerService, OpportunityService, InteractionService],
  exports: [CustomerService, OpportunityService, InteractionService],
})
export class CrmModule {}
