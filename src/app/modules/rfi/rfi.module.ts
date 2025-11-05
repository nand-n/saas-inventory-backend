import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rfi } from './entities/rfi.entity';
import { RfiQuestion } from './entities/rfi-question.entity';
import { RfiService } from './rfi.service';
import { RfiController } from './rfi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rfi, RfiQuestion])],
  controllers: [RfiController],
  providers: [RfiService],
})
export class RfiModule {}
