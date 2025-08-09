import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../supliers/entities/suplier.entity';
import { RFQController } from './rfq.controller';
import { RFQService } from './rfq.service';
import { RFQ } from './entities/rfq.entity';
import { RFQItem } from './entities/rfq-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RFQ, RFQItem, Supplier])],
  controllers: [RFQController],
  providers: [RFQService],
  exports:[RFQService]
})
export class RFQModule {}
