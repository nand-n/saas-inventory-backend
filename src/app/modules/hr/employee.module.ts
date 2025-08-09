import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Department } from '../department/entities/department.entity';
import { User } from '../users/entities/user.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department, User])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
   exports: [EmployeeService],
})
export class EmployeeModule {}
