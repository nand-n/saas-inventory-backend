import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { User } from '../users/entities/user.entity';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Branch } from '../branchs/entities/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, Branch, User]),
  ],
  providers: [DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
