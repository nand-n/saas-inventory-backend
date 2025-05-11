import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { PermissionGroup } from "./entities/permission-group.entity";
import { PermissionsController } from "./permissions.controller";
import { PermissionGroupsController } from "./permission-groups.controller";
import { PermissionsService } from "./permissions.service";
import { PermissionGroupsService } from "./permission-groups.service";
import { UsersModule } from "../users/users.module";


@Module({
  imports: [TypeOrmModule.forFeature([Permission , PermissionGroup]) , UsersModule],
  controllers: [PermissionsController , PermissionGroupsController],
  providers: [PermissionsService ,PermissionGroupsService ],
  exports: [PermissionsService,PermissionGroupsService],
})
export class PermissionsModule {}
