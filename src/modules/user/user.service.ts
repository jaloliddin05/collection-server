import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersRepository } from './user.repository';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
    private readonly connection: DataSource,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<User>,
  ): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options, {
      order: {
        name: 'ASC',
      },
    });
  }

  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async getOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async deleteOne(id: string) {
    const response = await this.usersRepository.delete(id);
    return response;
  }

  async change(
    value: UpdateUserDto,
    id: string,
    file: Express.Multer.File,
    request,
  ) {
    const response = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(value as unknown as User)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async create(userData: CreateUserDto, file: Express.Multer.File, request) {
    try {
      const user = new User();
      user.name = userData.name;
      user.email = userData.email;
      await user.hashPassword(userData.password);
      await this.connection.transaction(async (manager: EntityManager) => {
        await manager.save(user);
      });

      const newUser = await this.getOne(user.id);
      return newUser;
    } catch (err) {
      if (err?.errno === 1062) {
        throw new Error('This user already exists.');
      }
      throw err;
    }
  }
}
