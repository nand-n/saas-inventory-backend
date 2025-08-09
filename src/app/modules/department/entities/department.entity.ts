// src/departments/entities/department.entity.ts

import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Branch } from '../../branchs/entities/branch.entity';
import { BaseModel } from '@root/src/database/base.model';
import { Employee } from '../../hr/entities/employee.entity';

@Entity('departments')
export class Department extends BaseModel {
  @Column()
  name!: string;

  @Column({ unique: true })
  code!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column({ nullable: true })
  location!: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  budget!: number;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => Department, department => department.subDepartments, { nullable: true })
  parentDepartment!: Department;

  @OneToMany(() => Department, department => department.parentDepartment)
  subDepartments!: Department[];

  @OneToMany(() => Employee, employee => employee.department)
  employees!: Employee[];

  @ManyToOne(() => User, { nullable: true })
  manager!: User;

  @ManyToOne(() => Branch, branch => branch.departments)
  branch!: Branch;

  @Column()
  branchId!: string;
}
