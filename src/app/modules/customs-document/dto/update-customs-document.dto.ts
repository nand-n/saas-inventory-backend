import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomsDocumentDto } from "./create-customs-document.dto";

export class UpdateCustomsDocumentDto extends PartialType(CreateCustomsDocumentDto) {}
