import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, ILike } from 'typeorm';

import { Tag } from './tag.entity';
import { TagRepository } from './tag.repository';
import { CreateTagDto, UpdateTagDto } from './dto';

Injectable();
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: TagRepository,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Tag>,
  ): Promise<Pagination<Tag>> {
    return paginate<Tag>(this.tagRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getMoreByIds(ids: string[]) {
    const data = await this.tagRepository
      .createQueryBuilder()
      .where('id IN(:...ids)', { ids })
      .getMany();

    return data;
  }

  async getOne(id: string) {
    const data = await this.tagRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async getTagsByTitle(title: string) {
    const data = await this.tagRepository.find({
      where: {
        title: ILike(`%${title}%`),
      },
    });
    return data;
  }

  async deleteOne(id: string) {
    const response = await this.tagRepository.delete(id);
    return response;
  }

  async change(value: UpdateTagDto, id: string) {
    const response = await this.tagRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateTagDto) {
    const data = this.tagRepository.create(value);
    return await this.tagRepository.save(data);
  }
}
