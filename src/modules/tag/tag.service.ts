import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Tag } from './tag.entity';
import { CreateTagDto, UpdateTagDto } from './dto';

Injectable();
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
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

  async getItemsByTag(id: string, userId: string) {
    const data = await this.tagRepository.findOne({
      where: { id },
      relations: {
        items: {
          avatar: true,
          likedUsers: true,
          tags: true,
        },
      },
    });

    const items = [];

    data.items.forEach((c) => {
      if (c.likedUsers.find((l) => l.id == userId)) {
        items.push({ ...c, isLiked: true });
      } else {
        items.push({ ...c, isLiked: false });
      }
    });

    return { ...data, items };
  }

  async getOne(id: string) {
    const data = await this.tagRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

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

  async getByTitle(title: string) {
    const data = await this.tagRepository.findOne({ where: { title } });
    return data;
  }

  async deleteOne(id: string) {
    const response = await this.tagRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });

    return response;
  }

  async change(value: UpdateTagDto, id: string) {
    const response = await this.tagRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateTagDto) {
    const tag = await this.getByTitle(value.title);
    if (tag) {
      return tag;
    }
    const data = this.tagRepository.create(value);
    const res = await this.tagRepository.save(data);
    return { ...res, isNew: true };
  }
}
