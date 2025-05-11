// import { BaseModel } from "@root/src/database/base.model";
// import { Column, Entity, ManyToOne, Tree, TreeChildren, TreeParent } from "typeorm";
// import { Tenant } from "../../tenants/entities/tenants.entity";
// import { User } from "../../users/entities/user.entity";
// import { Branch } from "../../branchs/entities/branch.entity";

// // organizational-node.entity.ts
// @Entity()
// @Tree('materialized-path')
// export class OrganizationalNode extends BaseModel {
//   @Column()
//   title: string; // e.g., "CEO", "Branch Manager"
  
//   @Column({ nullable: true })
//   roleType: string; // "executive", "management", "operational" , "marketing"

//   @TreeParent()
//   parent: OrganizationalNode | null;

//   @TreeChildren({ cascade: true })
//   children: OrganizationalNode[];

//   @ManyToOne(() => Tenant)
//   tenant: Tenant;

//   @Column()
//   tenantId: string;

//   @ManyToOne(() => User, { nullable: true })
//   user: User | null; // The person occupying this position

//   @Column({ nullable: true })
//   userId: string;

//   @ManyToOne(() => Branch, { nullable: true })
//   branch: Branch | null; // Associated branch (if applicable)

//   @Column({ nullable: true })
//   branchId: string;

//   // Hierarchy visualization
//   toHierarchy() {
//     return {
//       id: this.id,
//       title: this.title,
//       user: this.user ? { id: this.user.id, firstName: this.user.firstName ,lastName: this.user.lastName , email:this.user.email  } : null,
//       branch: this.branch ? { id: this.branch.id, name: this.branch.name } : null,
//       children: this.children?.map(c => c.toHierarchy()) || []
//     };
//   }
// }

// organizational-node.entity.ts
// import { BaseModel } from "@root/src/database/base.model";
// import { Column, Entity, ManyToOne, Tree, TreeChildren, TreeParent } from "typeorm";
// import { Tenant } from "../../tenants/entities/tenants.entity";
// import { User } from "../../users/entities/user.entity";
// import { Branch } from "../../branchs/entities/branch.entity";

// @Entity()
// @Tree('closure-table', {
//   closureTableName: 'organizational_closure',
//   // ancestorColumnName: (column) => column.ancestor?.id?.toString(),
//   // descendantColumnName: (column) => column.descendant?.id?.toString(),
// })
// export class OrganizationalNode extends BaseModel {
//   @Column()
//   title: string;

//   @Column({ nullable: true })
//   roleType: string;

//   @TreeParent({ onDelete: 'CASCADE' })
//   parent: OrganizationalNode | null;

//   @TreeChildren({ cascade: true })
//   children: OrganizationalNode[];

//   @ManyToOne(() => Tenant)
//   tenant: Tenant;

//   @Column()
//   tenantId: string;

//   @ManyToOne(() => User, { nullable: true })
//   user: User | null;

//   @Column({ nullable: true })
//   userId: string;

//   @ManyToOne(() => Branch, { nullable: true })
//   branch: Branch | null;

//   @Column({ nullable: true })
//   branchId: string;

//   toHierarchy() {
//     return {
//       id: this.id,
//       title: this.title,
//       user: this.user ? { 
//         id: this.user.id, 
//         firstName: this.user.firstName,
//         lastName: this.user.lastName,
//         email: this.user.email  
//       } : null,
//       branch: this.branch ? { 
//         id: this.branch.id, 
//         name: this.branch.name 
//       } : null,
//       children: this.children?.map(c => c.toHierarchy()) || []
//     };
//   }
// }

import { BaseModel } from "@root/src/database/base.model";
import { Column, Entity, ManyToOne, Tree, TreeChildren, TreeParent } from "typeorm";
import { Tenant } from "../../tenants/entities/tenants.entity";
import { User } from "../../users/entities/user.entity";
import { Branch } from "../../branchs/entities/branch.entity";

@Entity()
@Tree("closure-table")
export class OrganizationalNode extends BaseModel {
  @Column()
  title: string;

  @Column({ nullable: true })
  roleType: string;

  @TreeParent({ onDelete: "CASCADE" })
  parent: OrganizationalNode | null;

  @TreeChildren({ cascade: true })
  children: OrganizationalNode[];

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @ManyToOne(() => User, { nullable: true })
  user: User | null;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Branch, { nullable: true })
  branch: Branch | null;

  @Column({ nullable: true })
  branchId: string;

  toHierarchy() {
    return {
      id: this.id,
      title: this.title,
      user: this.user
        ? {
            id: this.user.id,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
          }
        : null,
      branch: this.branch
        ? {
            id: this.branch.id,
            name: this.branch.name,
          }
        : null,
      children: this.children?.map((c) => c.toHierarchy()) || [],
    };
  }
}
