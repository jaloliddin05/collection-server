import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

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
import { FileService } from '../file/file.service';
import { hashPassword } from '../../infra/helpers';
import { UserRole } from '../../infra/shared/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
    private readonly fileService: FileService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<User>,
  ): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options, {
      order: {
        name: 'ASC',
      },
      relations: {
        avatar: true,
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

  async getOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        collections: {
          avatar: true,
          likedUsers: true,
        },
        avatar: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const collections = [];

    user.collections.forEach((c) => {
      if (c.likedUsers.find((l) => l.id == id)) {
        collections.push({ ...c, isLiked: true });
      } else {
        collections.push({ ...c, isLiked: false });
      }
    });

    return { ...user, collections };
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async deleteOne(id: string) {
    await this.deleteImage(id);
    const response = await this.usersRepository.delete(id);
    return response;
  }

  async change(
    value: UpdateUserDto,
    id: string,
    file: Express.Multer.File,
    request,
  ) {
    if (file) {
      const avatar = await this.updateImage(file, id, request);
      value.avatar = avatar;
    }
    const response = await this.usersRepository.update({ id }, value);

    return response;
  }

  async changeRole(id: string, role: UserRole) {
    const response = await this.usersRepository.update({ id }, { role });
    return response;
  }

  async create(data: CreateUserDto) {
    try {
      data.password = await hashPassword(data.password);
      const user = this.usersRepository.create(data);
      return this.usersRepository.save(user);
    } catch (err) {
      if (err?.errno === 1062) {
        throw new Error('This user already exists.');
      }
      throw err;
    }
  }

  async uploadImage(file: Express.Multer.File, request) {
    const avatar = await this.fileService.uploadFile(file, request);
    return avatar;
  }

  async updateImage(file: Express.Multer.File, id: string, request) {
    const data = await this.getOne(id);
    let avatar;
    if (data?.avatar?.id) {
      avatar = await this.fileService.updateFile(data.avatar.id, file, request);
    } else {
      avatar = await this.fileService.uploadFile(file, request);
    }

    return avatar;
  }

  async deleteImage(id: string) {
    const data = await this.getOne(id);
    if (data?.avatar?.id) {
      await this.fileService.removeFile(data.avatar.id);
    }
  }
}
