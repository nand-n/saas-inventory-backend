import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../product/products.module';
import { Customer } from './entities/customers.entity';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Customer]) , ProductsModule],
  providers: [CustomersService],
  controllers: [CustomersController],
  exports: [CustomersService],
})
export class CustomersModule {}