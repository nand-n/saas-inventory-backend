export enum UserRole {
  // System roles
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  ANALYST = 'analyst',
  VIEWER = 'viewer',

  //Tenant Specific Roles
  TENANT_OWNER = 'tenant_owner',
  TENANT_USER = 'tenant_user',
  TENANT_ADMIN = 'tenant_admin',


  // Branch specific roles
  BRANCH_MANAGER = 'branch_manager',
  BRANCH_STAFF = 'branch_staff',

  // HR specific roles
  HR_ADMIN = 'hr_admin',
  HR_EMPLOYEE = 'hr_employee',
  EMPLOYEE = 'employee',

  // Inventory specific roles
  INVENTORY_MANAGER = 'inventory_manager',

  
  // Department specific roles
  ACCOUNTANT = 'accountant',
  CFO = 'cfo',
  HR_MANAGER = 'hr_manager',
  HR_SPECIALIST = 'hr_specialist',
  WAREHOUSE_MANAGER = 'warehouse_manager',
  WAREHOUSE_WORKER = 'warehouse_worker',
  STORE_MANAGER = 'store_manager',
  CASHIER = 'cashier',
  SALES_MANAGER = 'sales_manager',
  SALES_REP = 'sales_rep',
  PROCUREMENT_MANAGER = 'procurement_manager',
  PROCUREMENT_SPECIALIST = 'procurement_specialist',
  CUSTOMER_SERVICE = 'customer_service',
  
  // Import/Export specific
  CUSTOMS_SPECIALIST = 'customs_specialist',
  LOGISTICS_COORDINATOR = 'logistics_coordinator',
  TRADE_COMPLIANCE = 'trade_compliance'
}