import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get('tenant/:tenantId')
  async findByTenant(@Param('tenantId') tenantId: string) {
    return this.usersService.findByTenant(tenantId);
  }
   @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }
  // Get user by ID
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Get user by email
 

  // Get user with permission groups
  @Get(':id/permissions')
  async findOneWithPermission(@Param('id') id: string) {
    return this.usersService.findOneWithPermission(id);
  }

  // Get all users by tenant ID


  // Update a user
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>) {
    return this.usersService.update(id, updateUserDto);
  }
}
