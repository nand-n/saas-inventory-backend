import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';
import { Risk } from './entities/risks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Risk])],
  controllers: [RiskController],
  providers: [RiskService],
  exports: [RiskService],
})
export class RiskModule {}
