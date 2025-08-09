import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { User } from '../users/entities/user.entity';
import { Branch } from '../branchs/entities/branch.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const dept = this.deptRepo.create(dto);

    // attach branch
    const branch = await this.branchRepo.findOneByOrFail({ id: dto.branchId });
    dept.branch = branch;

    // attach parent department if provided
    if (dto.parentDepartmentId) {
      dept.parentDepartment = await this.deptRepo.findOneByOrFail({ id: dto.parentDepartmentId });
    }

    // attach manager if provided
    if (dto.managerId) {
      dept.manager = await this.userRepo.findOneByOrFail({ id: dto.managerId });
    }

    return this.deptRepo.save(dept);
  }

  findAll(): Promise<Department[]> {
    return this.deptRepo.find({
      relations: ['branch', 'parentDepartment', 'subDepartments', 'manager', 'employees'],
    });
  }

  async findOne(id: string): Promise<Department> {
    const dept = await this.deptRepo.findOne({
      where: { id },
      relations: ['branch', 'parentDepartment', 'subDepartments', 'manager', 'employees'],
    });
    if (!dept) throw new NotFoundException(`Department ${id} not found`);
    return dept;
  }


async findDepartmentsPerTenant(tenantId: string): Promise<Department[]> {
  const departments = await this.deptRepo.find({
    where: {
      branch: { tenantId },
    },
    relations: ['branch', 'parentDepartment', 'subDepartments', 'manager', 'employees'],
  });

  if (!departments.length) {
    throw new NotFoundException(`No departments found for tenant ${tenantId}`);
  }

  return departments;
}

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const dept = await this.findOne(id);
    Object.assign(dept, dto);

    if (dto.branchId) {
      dept.branch = await this.branchRepo.findOneByOrFail({ id: dto.branchId });
    }
    if (dto.parentDepartmentId) {
      dept.parentDepartment = await this.deptRepo.findOneByOrFail({ id: dto.parentDepartmentId });
    }
    if (dto.managerId) {
      dept.manager = await this.userRepo.findOneByOrFail({ id: dto.managerId });
    }

    return this.deptRepo.save(dept);
  }

  async remove(id: string): Promise<void> {
    const dept = await this.findOne(id);
    await this.deptRepo.remove(dept);
  }
}
