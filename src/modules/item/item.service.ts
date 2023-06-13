import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { Item } from './item.entity';
import { ItemRepository } from './item.repository';
import { CreateItemDto, UpdateItemDto } from './dto';

Injectable();
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Item>,
  ): Promise<Pagination<Item>> {
    return paginate<Item>(this.itemRepository, options, {
      order: {
        name: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.itemRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.itemRepository.delete(id);
    return response;
  }

  async change(value: UpdateItemDto, id: string) {
    const response = await this.itemRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Item)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateItemDto) {
    const data = this.itemRepository
      .createQueryBuilder()
      .insert()
      .into(Item)
      .values(value as unknown as Item)
      .execute();

    return data;
  }
}
