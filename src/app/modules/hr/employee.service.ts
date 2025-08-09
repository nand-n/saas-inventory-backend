// src/employee/employee.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from '../users/entities/user.entity';
import { Department } from '../department/entities/department.entity';
import { UserRole } from '../users/enums/user.enum';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,

    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

async create(dto: CreateEmployeeDto): Promise<Employee> {
  // 🧩 Generate next employee number
  const lastEmployee = await this.employeeRepo
    .createQueryBuilder('employee')
    .orderBy('employee.employeeNumber', 'DESC')
    .getOne();

  let nextNumber = 1;
  if (lastEmployee && lastEmployee.employeeNumber) {
    const lastNumberPart = parseInt(lastEmployee.employeeNumber.replace('EMP-', ''));
    if (!isNaN(lastNumberPart)) {
      nextNumber = lastNumberPart + 1;
    }
  }
  const employeeNumber = `EMP-${1 + nextNumber}`; 

  const employee = this.employeeRepo.create({
    ...dto,
    employeeNumber, 
  });

 const department = await this.departmentRepo.findOneOrFail({
  where: { id: dto.departmentId },
  relations: ['branch'],
});  employee.department = department;

  if (dto.supervisorId) {
    const supervisor = await this.employeeRepo.findOneByOrFail({ id: dto.supervisorId });
    employee.supervisor = supervisor;
  }

  const user = this.userRepo.create({
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    phone: dto.phone,
    password: '123456',
    roles: [UserRole.EMPLOYEE],
    departmentId: dto.departmentId,
    tenantId:department.branch.tenantId,
    branchId: department.branchId,
  });

  const createdUser = await this.userRepo.save(user);
  employee.user = createdUser;

  return this.employeeRepo.save(employee);
}


  findAll(): Promise<Employee[]> {
    return this.employeeRepo.find({
      relations: ['department', 'supervisor', 'user'],
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: ['department', 'supervisor', 'user'],
    });
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    Object.assign(employee, dto);

    if (dto.departmentId) {
      employee.department = await this.departmentRepo.findOneByOrFail({ id: dto.departmentId });
    }

    if (dto.supervisorId) {
      employee.supervisor = await this.employeeRepo.findOneByOrFail({ id: dto.supervisorId });
    }

    if (dto.userId) {
      employee.user = await this.userRepo.findOneByOrFail({ id: dto.userId });
    }

    return this.employeeRepo.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepo.remove(employee);
  }
}
