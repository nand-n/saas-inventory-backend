import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(
      userData,
    );
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } , relations:["tenant"] });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findOneWithPermission(userId:string): Promise<User>{
  const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['permissionGroups'],
    });
    if(!user){
      throw new Error('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.findById(id);
    return updatedUser;
  }
  
}