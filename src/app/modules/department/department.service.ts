import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  ) { }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const branch = await this.branchRepo.findOneBy({ id: dto.branchId });
    if (!branch) throw new NotFoundException(`Branch ${dto.branchId} not found`);

    if (dto.parentDepartmentId) {
      const parent = await this.deptRepo.findOne({
        where: { id: dto.parentDepartmentId },
        relations: ['branch'],
      });
      if (!parent) throw new NotFoundException(`Parent department ${dto.parentDepartmentId} not found`);
      if (parent.branch.tenantId !== branch.tenantId) {
        throw new BadRequestException('Parent department must belong to the same tenant');
      }
    }

    if (dto.managerId) {
      const manager = await this.userRepo.findOne({
        where: { id: dto.managerId },
        relations: ['tenant'],
      });
      if (!manager) throw new NotFoundException(`Manager ${dto.managerId} not found`);
      // Optional: Check if manager belongs to the same tenant
      // if (manager.tenant?.id !== branch.tenantId) {
      //   throw new BadRequestException('Manager must belong to the same tenant');
      // }
    }

    const dept = this.deptRepo.create(dto);
    dept.branch = branch;

    if (dto.parentDepartmentId) {
      dept.parentDepartment = await this.deptRepo.findOneBy({ id: dto.parentDepartmentId }) as Department;
    }
    if (dto.managerId) {
      dept.manager = await this.userRepo.findOneBy({ id: dto.managerId }) as User;
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

    return departments;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const dept = await this.findOne(id);

    const branchId = dto.branchId || dept.branchId;
    const branch = await this.branchRepo.findOneBy({ id: branchId });
    if (!branch) throw new NotFoundException(`Branch ${branchId} not found`);

    if (dto.parentDepartmentId) {
      if (dto.parentDepartmentId === id) {
        throw new BadRequestException('A department cannot be its own parent');
      }

      const parent = await this.deptRepo.findOne({
        where: { id: dto.parentDepartmentId },
        relations: ['branch'],
      });
      if (!parent) throw new NotFoundException(`Parent department ${dto.parentDepartmentId} not found`);

      if (parent.branch.tenantId !== branch.tenantId) {
        throw new BadRequestException('Parent department must belong to the same tenant');
      }

      // Check for deeper circularity
      let currentParent = parent;
      const visited = new Set<string>([id]);
      while (currentParent.parentDepartment) {
        if (visited.has(currentParent.id)) {
          throw new BadRequestException('Circular hierarchy detected');
        }
        visited.add(currentParent.id);
        const nextParent = await this.deptRepo.findOne({
          where: { id: currentParent.parentDepartment.id },
          relations: ['parentDepartment'],
        });
        if (!nextParent) break;
        currentParent = nextParent;
        if (currentParent.id === id) {
          throw new BadRequestException('Circular hierarchy detected');
        }
      }
    }

    Object.assign(dept, dto);

    if (dto.branchId) {
      dept.branch = branch;
    }
    if (dto.parentDepartmentId) {
      dept.parentDepartment = await this.deptRepo.findOneBy({ id: dto.parentDepartmentId }) as Department;
    }
    if (dto.managerId) {
      dept.manager = await this.userRepo.findOneBy({ id: dto.managerId }) as User;
    }

    return this.deptRepo.save(dept);
  }

  async remove(id: string): Promise<void> {
    const dept = await this.deptRepo.findOne({
      where: { id },
      relations: ['subDepartments', 'employees'],
    });

    if (!dept) {
      throw new NotFoundException(`Department ${id} not found`);
    }

    if (dept.subDepartments && dept.subDepartments.length > 0) {
      throw new BadRequestException(
        `Cannot delete department with sub-departments. Please transfer or delete sub-departments first.`,
      );
    }

    if (dept.employees && dept.employees.length > 0) {
      throw new BadRequestException(
        `Cannot delete department with active employees. Please transfer employees to another department first.`,
      );
    }

    await this.deptRepo.remove(dept);
  }
}
