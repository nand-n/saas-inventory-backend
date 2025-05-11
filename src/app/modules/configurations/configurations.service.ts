import {
  BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { DataSource, IsNull, Repository, TreeRepository } from 'typeorm';
  import { Configurations } from './entities/configurations.entity';
import { CreateConfigurationsDto } from './dtos/create-configurations.dtos';
import { UpdateConfigurationsDto } from './dtos/update-configurations.dto';
import { OrganizationalNode } from './entities/organizational-node.entity';
import { BranchesService } from '../branchs/branches.service';
import { CreateNodeDto, UpdateNodeDto } from './dtos/create-node-dto';
  
  @Injectable()
  export class ConfigurationsService {
    constructor(
      @InjectRepository(Configurations)
      private readonly configurationsRepository: Repository<Configurations>,
      @InjectRepository(OrganizationalNode)
      private orgRepository: TreeRepository<OrganizationalNode>,
      private brnachService: BranchesService,
      private readonly dataSource: DataSource

    ) {}
  
    async create(createConfigurationsDto: CreateConfigurationsDto) {
      const config = this.configurationsRepository.create({
        ...createConfigurationsDto,
        seoSettings: {
          ...createConfigurationsDto.seoSettings,
        },
      });
      return this.configurationsRepository.save(config);
    }

  async getNode(nodeId: string, tenantId: string): Promise<OrganizationalNode> {
    const node = await this.orgRepository.findOne({
      where: { id: nodeId, tenantId },
      relations: ['parent', 'children', 'user', 'branch']
    });
    
    if (!node) {
      throw new NotFoundException(`Organization node ${nodeId} not found`);
    }
    return node;
  }

  async getOrganizationStructure(
    tenantId: string,
    rootNodeId?: string,
    depth?: number
  ): Promise<OrganizationalNode> {
    let root: OrganizationalNode | undefined;

    if (rootNodeId) {
      const foundRoot = await this.orgRepository.findOne({
        where: { id: rootNodeId, tenantId },
        relations: ['children, parent', 'user', 'branch']
      });

      if (!foundRoot) {
        throw new NotFoundException(`Root node ${rootNodeId} not found`);
      }

      root = foundRoot;

      if (!root?.parent) {
        throw new NotFoundException(`Root node ${rootNodeId} not found`);
      }
    } else {
      const roots = await this.orgRepository.findRoots();
      root = roots.find(r => r.tenantId === tenantId);
      if (!root) {
        throw new NotFoundException(`No organization structure found for tenant ${tenantId}`);
      }
      if (!root) {
        throw new NotFoundException(`No organization structure found for tenant ${tenantId}`);
      }
      if (!root) {
        throw new NotFoundException(`No organization structure found for tenant ${tenantId}`);
      }
      if (!root) {
        throw new NotFoundException(`No organization structure found`);
      }
    }

    const tree = await this.orgRepository.findDescendantsTree(root);

    if (depth && depth > 0) {
      this.limitTreeDepth(tree, depth);
    }

    return tree;
  }

  async getOrgTreeByTenantId(tenantId: string) {
    const treeRepo = this.dataSource.getTreeRepository(OrganizationalNode);
  
    const roots = await treeRepo.find({
      where: { tenantId, parent: IsNull() },
      relations: ["tenant", "user", "branch"],
    });
  
    const fullTrees = await Promise.all(
      roots.map(async (root) => {
        const fullTree = await treeRepo.findDescendantsTree(root, {
          relations: ["user", "branch"],
        });
        return fullTree;
      })
    );
  
    return fullTrees.map((node) => node.toHierarchy());
  }

  private limitTreeDepth(node: OrganizationalNode, remainingDepth: number): void {
    if (remainingDepth <= 0) {
      node.children = [];
      return;
    }

    node.children?.forEach(child => {
      this.limitTreeDepth(child, remainingDepth - 1);
    });
  }

  async createOrganizationNode(createDto: CreateNodeDto): Promise<OrganizationalNode> {
    // 1. Prevent multiple roots for a single tenant
    if (!createDto.parentId) {
      const existingRoot = await this.orgRepository.findOne({
        where: { tenantId: createDto.tenantId, parent: IsNull() },
      });
  
      if (existingRoot) {
        throw new BadRequestException("This tenant already has a root organizational node");
      }
    }
  
    // 2. Create a new node instance
    const node = this.orgRepository.create(createDto);
  
    // 3. Assign parent if parentId is provided
    if (createDto.parentId) {
      const parentNode = await this.orgRepository.findOneBy({
        id: createDto.parentId,
        tenantId: createDto.tenantId,
      });
  
      if (!parentNode) {
        throw new NotFoundException("Parent node not found or does not belong to this tenant");
      }
  
      node.parent = parentNode;
    }
  
    // 4. Save and return
    return this.orgRepository.save(node);
  }

  async updateOrganizationNode(
    nodeId: string,
    tenantId: string,
    updateData: UpdateNodeDto
  ): Promise<OrganizationalNode> {
    const node = await this.getNode(nodeId, tenantId);

    if (updateData.parentId) {
      node.parent = await this.getNode(updateData.parentId, tenantId);
    }

    const updated = this.orgRepository.merge(node, updateData);
    return this.orgRepository.save(updated);
  }

  async removeOrganizationNode(nodeId: string, tenantId: string): Promise<void> {
    const node = await this.getNode(nodeId, tenantId);
    
    if (node.children?.length > 0) {
      throw new NotFoundException(
        `Node has children. Reassign them before deletion.`
      );
    }

    await this.orgRepository.remove(node);
  }

  async linkBranchToNode(
    nodeId: string, 
    branchId: string, 
    tenantId: string
  ): Promise<OrganizationalNode> {
    const node = await this.getNode(nodeId, tenantId);
    const branch = await this.brnachService.findOne(branchId, tenantId);
    
    node.branch = branch;
    return this.orgRepository.save(node);
  }

  async initializeDefaultStructure(tenantId: string): Promise<OrganizationalNode> {
    const ceo = await this.createOrganizationNode({
      title: 'CEO',
      tenantId,
      roleType: 'executive'
    });

    return this.getFullOrganizationHierarchy(tenantId);
  }

  async getFullOrganizationHierarchy(tenantId: string): Promise<OrganizationalNode> {
    const roots = await this.orgRepository.findRoots();
    const tenantRoot = roots.find(root => root.tenantId === tenantId);
    
    if (!tenantRoot) {
      throw new NotFoundException(`Organization structure not initialized`);
    }
    
    return this.orgRepository.findDescendantsTree(tenantRoot);
  }

    async findOne(tenantId: string) {
      const config = await this.configurationsRepository.findOneBy({ tenantId });
      if (!config) {
        throw new NotFoundException(`Configuration for tenant ${tenantId} not found`);
      }
      return config;
    }
  
    async update(tenantId: string, updateConfigurationsDto: UpdateConfigurationsDto) {
      const config = await this.findOne(tenantId);
      const updated = this.configurationsRepository.merge(config, updateConfigurationsDto as any);
      return this.configurationsRepository.save(updated);
    }
  
    async remove(tenantId: string) {
      const result = await this.configurationsRepository.delete(tenantId);
      if (result.affected === 0) {
        throw new NotFoundException(`Configuration for tenant ${tenantId} not found`);
      }
    }
  }