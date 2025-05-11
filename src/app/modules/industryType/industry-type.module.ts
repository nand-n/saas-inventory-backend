import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IndustryType } from "./entitities/industryType.entity";
import { IndustryTypeController } from "./industry-type.controller";
import { IndustryTypeService } from "./industry-type.service";

@Module({
  imports: [TypeOrmModule.forFeature([IndustryType])],
  controllers: [IndustryTypeController],
  providers: [IndustryTypeService],
  exports: [IndustryTypeService],
})
export class IndustryTypeModule {}
