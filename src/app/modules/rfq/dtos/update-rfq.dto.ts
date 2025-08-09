import { PartialType } from '@nestjs/mapped-types';
import { CreateRFQDto } from './create-rfq.dto';

export class UpdateRFQDto extends PartialType(CreateRFQDto) {}
