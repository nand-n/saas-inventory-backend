import { PartialType } from '@nestjs/swagger';
import { CreateGoodsReceiptDto } from './create-grn.dto';

export class UpdateGoodsReceiptDto extends PartialType(CreateGoodsReceiptDto) {}
