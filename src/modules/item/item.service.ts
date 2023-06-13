import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager, FindOptionsWhere } from 'typeorm';

import { Item } from './item.entity';
import { ItemRepository } from './item.repository';
import { CreateItemDto, UpdateItemDto } from './dto';
import { TagService } from '../tag/tag.service';
import { CollectionService } from '../collection/collection.service';

Injectable();
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    private readonly tagService: TagService,
    private readonly collectionService: CollectionService,
    private readonly connection: DataSource,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Item>,
  ): Promise<Pagination<Item>> {
    return paginate<Item>(this.itemRepository, options, {
      order: {
        name: 'ASC',
      },
      relations: {
        tags: true,
        collection: true,
      },
    });
  }

  async getOne(id: string) {
    const data = await this.itemRepository.findOne({
      where: { id },
      relations: {
        collection: true,
        tags: true,
      },
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
    const tags = await this.tagService.getMoreByIds(value.tags);
    const collection = await this.collectionService.getOne(value.collection);

    const item = new Item();
    item.name = value.name;
    item.collection = collection;
    item.tags = tags;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(item);
    });

    return item;
  }

  async addTag(tagId: string, itemId: string) {
    const tag = await this.tagService.getOne(tagId);
    const item = await this.getOne(itemId);

    item.tags.push(tag);
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(item);
    });

    return item;
  }

  async removeTag(tagId: string, itemId: string) {
    const item = await this.getOne(itemId);

    item.tags = item.tags.filter((t) => t.id != tagId);
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(item);
    });

    return item;
  }
}
