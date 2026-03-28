import { DataSource } from 'typeorm';
import { dataSourceOptions } from './migration-data-source';
import { IndustryType } from '../app/modules/industryType/entitities/industryType.entity';
import { Tenant } from '../app/modules/tenants/entities/tenants.entity';
import { Branch } from '../app/modules/branchs/entities/branch.entity';
import { Department } from '../app/modules/department/entities/department.entity';
import { User } from '../app/modules/users/entities/user.entity';
import { UserRole } from '../app/modules/users/enums/user.enum';
import { InventoryCategory } from '../app/modules/inventory/entities/inventory-category.entity';
import { Supplier, SupplierStatus } from '../app/modules/supliers/entities/suplier.entity';
import { Product } from '../app/modules/product/entities/product.entity';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
    return `${salt}:${hash}`;
}

async function seed() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    // Clear existing data (optional but recommended for a clean seed)
    // Be careful with order due to foreign keys
    await queryRunner.query('TRUNCATE "products", "suppliers", "inventory_category", "users", "departments", "branch", "tenants", "industry_type" CASCADE');

    const industryTypeRepo = dataSource.getRepository(IndustryType);
    const tenantRepo = dataSource.getRepository(Tenant);
    const branchRepo = dataSource.getRepository(Branch);
    const departmentRepo = dataSource.getRepository(Department);
    const userRepo = dataSource.getRepository(User);
    const categoryRepo = dataSource.getRepository(InventoryCategory);
    const supplierRepo = dataSource.getRepository(Supplier);
    const productRepo = dataSource.getRepository(Product);

    // 1. Seed Industry Type
    const industry = industryTypeRepo.create({
        name: 'Technology',
        description: 'Software and Hardware development'
    });
    await industryTypeRepo.save(industry);
    console.log('Seeded IndustryType');

    // 2. Seed Tenant
    const tenant = tenantRepo.create({
        name: 'Acme Corp',
        contactEmail: 'admin@acme.com',
        numberOfBranches: 2,
        isActive: true,
        industryType: industry
    });
    await tenantRepo.save(tenant);
    console.log('Seeded Tenant');

    // 3. Seed Branches
    const warehouse = branchRepo.create({
        name: 'Main Warehouse',
        location: 'Industrial Zone A',
        type: 'warehouse',
        tenant: tenant,
        tenantId: tenant.id
    });
    const store = branchRepo.create({
        name: 'Downtown Store',
        location: 'City Center Mall',
        type: 'outlet',
        tenant: tenant,
        tenantId: tenant.id
    });
    await branchRepo.save([warehouse, store]);
    console.log('Seeded Branches');

    // 4. Seed Departments
    const itDept = departmentRepo.create({
        name: 'IT',
        code: 'IT001',
        description: 'Information Technology',
        branch: warehouse,
        branchId: warehouse.id
    });
    const salesDept = departmentRepo.create({
        name: 'Sales',
        code: 'SL001',
        description: 'Sales and Marketing',
        branch: store,
        branchId: store.id
    });
    await departmentRepo.save([itDept, salesDept]);
    console.log('Seeded Departments');

    // 5. Seed User (Admin)
    const adminUser = userRepo.create({
        firstName: 'Nahom',
        lastName: 'Debele',
        email: 'admin@admin.com',
        password: hashPassword('admin123'),
        phone: '1234567890',
        roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN],
        tenant: tenant,
        tenantId: tenant.id,
        branch: warehouse,
        branchId: warehouse.id,
        department: itDept,
        departmentId: itDept.id
    });
    await userRepo.save(adminUser);
    console.log('Seeded Admin User');

    // 6. Seed Inventory Categories
    const electronics = categoryRepo.create({
        category_name: 'Electronics',
        description: 'Electronic gadgets and components',
        tenant: tenant,
        tenant_id: tenant.id
    });
    const furniture = categoryRepo.create({
        category_name: 'Furniture',
        description: 'Office and home furniture',
        tenant: tenant,
        tenant_id: tenant.id
    });
    await categoryRepo.save([electronics, furniture]);
    console.log('Seeded Categories');

    // 7. Seed Suppliers
    const supplier1 = supplierRepo.create({
        name: 'Global Parts Inc',
        code: 'SUP001',
        email: 'info@globalparts.com',
        phone: '9876543210',
        address: {
            street: '123 Supply Road',
            city: 'Logistics City',
            state: 'TX',
            country: 'USA',
            zipCode: '75001'
        },
        status: SupplierStatus.ACTIVE
    });
    await supplierRepo.save(supplier1);
    console.log('Seeded Suppliers');

    // 8. Seed Products
    const laptop = productRepo.create({
        name: 'Pro Laptop 2024',
        sku: 'LAP-001',
        unit_price: 1200.00,
        unit_cost: 800.00,
        reorder_level: 5,
        category: electronics,
        category_id: electronics.id,
        description: 'High performance laptop for professionals',
        branch: warehouse,
        branch_id: warehouse.id,
        supplier: supplier1,
        quantity: 50
    });
    const chair = productRepo.create({
        name: 'Ergonomic Chair',
        sku: 'CHR-001',
        unit_price: 250.00,
        unit_cost: 150.00,
        reorder_level: 10,
        category: furniture,
        category_id: furniture.id,
        description: 'Comfortable office chair',
        branch: store,
        branch_id: store.id,
        supplier: supplier1,
        quantity: 30
    });
    await productRepo.save([laptop, chair]);
    console.log('Seeded Products');

    await dataSource.destroy();
    console.log('Seeding completed successfully!');
}

seed().catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
});
