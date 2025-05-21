import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosController } from './pos.controller';
import { Sale } from './entities/sale.entity';
import { SaleLine } from './entities/sale-line.entity';
import { AccountingModule } from '../accounting/accounting.module';
import { InventoryModule } from '../inventory/inventory.module';
import { PosService } from './pos.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleLine]),
    AccountingModule,
    InventoryModule,
    JwtModule,
    UsersModule,
  ],
  controllers: [PosController],
  providers: [PosService],
})
export class PosModule {}
