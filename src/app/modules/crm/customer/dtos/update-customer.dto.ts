import { PartialType } from '@nestjs/mapped-types';
import { CreateCRMCustomerDto } from './create-customer.dto';

export class UpdateCRMCustomerDto extends PartialType(CreateCRMCustomerDto) {}
