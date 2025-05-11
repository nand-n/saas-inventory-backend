import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const existingBranch = await this.branchRepository.findOne({
      where: { name: createBranchDto.name, tenantId: createBranchDto.tenantId },
    });

    if (existingBranch) {
      throw new ConflictException('Branch with this name already exists for the tenant');
    }

    const branch = this.branchRepository.create(createBranchDto);
    return this.branchRepository.save(branch);
  }

  async findAll(tenantId: string): Promise<Branch[]> {
    return this.branchRepository.find({ where: { tenantId: tenantId } });
  }

  async findOne(id: string, tenantId: string): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id, tenantId },
      relations:[""]
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async getBranchWithLeadership(branchId: string) {
    return this.branchRepository.findOne({
      where: { id: branchId },
      relations: ['leadershipStructure', 'leadershipStructure.user']
    });
  }

  async createDefaultBranchs(numberOfBranchs: number = 1, tenantId: string): Promise<Branch[]> {
    const createdBranches: Branch[] = [];
    let attempts = 0;

    // Create HQ branch if required
    if (numberOfBranchs >= 1) {
        try {
            const hqBranch = await this.create({
                name: 'HQ',
                tenantId,
                isActive: true,
                location: ''
            });
            createdBranches.push(hqBranch);
        } catch (error) {
            if (error instanceof ConflictException) {
                console.log('HQ branch already exists, skipping.');
            } else {
                throw error;
            }
        }
    }

    // Create Branch 1 to (numberOfBranchs - 1)
    const branchesToCreate = numberOfBranchs - createdBranches.length;
    for (let i = 1; i <= branchesToCreate; i++) {
        const branchName = `Branch ${i}`;
        try {
            const createDto: CreateBranchDto = {
                name: branchName,
                tenantId,
                isActive: true,
                location: ""
            };
            const branch = await this.create(createDto);
            createdBranches.push(branch);
        } catch (error) {
            if (error instanceof ConflictException) {
                console.log(`Branch name "${branchName}" already exists, skipping.`);
            } else {
                throw error;
            }
        }
        attempts++;
        if (attempts >= 1000) break;
    }

    if (createdBranches.length < numberOfBranchs) {
        throw new Error(`Failed to create the requested number of default branches. Only ${createdBranches.length} were created.`);
    }

    return createdBranches;
}
  async update(id: string, tenantId: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findOne(id, tenantId);
    return this.branchRepository.save({ ...branch, ...updateBranchDto });
  }

  async deactivate(id: string, tenantId: string): Promise<Branch> {
    const branch = await this.findOne(id, tenantId);
    branch.isActive = false;
    return this.branchRepository.save(branch);
  }
}