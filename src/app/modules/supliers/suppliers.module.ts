import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/suplier.entity';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { ProductsModule } from '../product/products.module';
import { PaginationModule } from 'src/core/pagination/pagination.module';


@Module({
  imports: [TypeOrmModule.forFeature([Supplier]), ProductsModule, PaginationModule],
  providers: [SuppliersService],
  controllers: [SuppliersController],
  exports: [SuppliersService],
})
export class SuppliersModule { }