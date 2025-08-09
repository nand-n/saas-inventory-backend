import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Department } from '../../department/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { Payroll } from '../../payroll/entities/payroll.entity';
import { BaseModel } from '@root/src/database/base.model';

export enum EmploymentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  ON_LEAVE = 'on_leave',
  PROBATION = 'probation'
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  TEMPORARY = 'temporary'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

@Entity('employees')
export class Employee extends BaseModel {

  @Column({ unique: true })
  employeeNumber!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  middleName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  alternatePhone!: string;

  @Column()
  dateOfBirth!: Date;

  @Column({ nullable: true })
  gender!: string;

  @Column({ nullable: true })
  position!: string;

  @Column({ nullable: true })
  nationality!: string;

  @Column({ nullable: true })
  education?: string;

  @Column({ nullable: true })
  experience?: string;

@Column("text", { array: true, nullable: true })
skills?: string[];

@Column("text", { array: true, nullable: true })
languages?: string[];
   
  @Column({ nullable: true })
profilePicture!: string;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    nullable: true
  })
  maritalStatus!: MaritalStatus;

  @Column('json', { nullable: true })
  address!: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column({ nullable: true })
  nationalId!: string;

  @Column({ nullable: true })
  socialSecurityNumber!: string;

  @Column({ nullable: true })
  taxId!: string;

  @Column()
  hireDate!: Date;

  @Column({ nullable: true })
  terminationDate!: Date;

  @Column()
  jobTitle!: string;

  @Column({
    type: 'enum',
    enum: EmploymentStatus,
    default: EmploymentStatus.ACTIVE
  })
  status!: EmploymentStatus;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME
  })
  employmentType!: EmploymentType;

  @Column('decimal', { precision: 15, scale: 2 })
  salary!: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  hourlyRate!: number;

  @Column('int', { default: 40 })
  weeklyHours!: number;

  @Column({ nullable: true })
  bankAccount!: string;

  @Column({ nullable: true })
  bankName!: string;

  @Column({ nullable: true })
  bankRoutingNumber!: string;

  @Column('json', { nullable: true })
  emergencyContact!: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };

  @Column('json', { nullable: true })
  benefits!: {
    healthInsurance: boolean;
    dentalInsurance: boolean;
    visionInsurance: boolean;
    lifeInsurance: boolean;
    retirementPlan: boolean;
    paidTimeOff: number;
    sickLeave: number;
  };

  @ManyToOne(() => Department, department => department.employees)
  department!: Department;

  @ManyToOne(() => Employee, { nullable: true })
  supervisor!: Employee;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  user!: User;

  @OneToMany(() => Payroll, payroll => payroll.employee)
  payrolls!: Payroll[];
}
