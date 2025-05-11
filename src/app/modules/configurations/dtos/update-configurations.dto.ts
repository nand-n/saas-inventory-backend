import { PartialType } from "@nestjs/swagger";
import { CreateConfigurationsDto } from "./create-configurations.dtos";

export class UpdateConfigurationsDto extends PartialType(CreateConfigurationsDto) {}
