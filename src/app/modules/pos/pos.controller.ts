import {
  Controller,
  Post,
  Body,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PosService } from './pos.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from '@root/src/core/guards/auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';

@Controller('pos')
@UseGuards(AuthGuard, RolesGuard)
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post('sale')
  async createSale(@Request() req: any, @Body() dto: CreateSaleDto) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.posService.createSale({ ...dto, tenantId });
  }
}
