import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Item } from './item.entity';
import { CreateItemDto, UpdateItemDto } from './dto';
import { TagService } from '../tag/tag.service';
import { CollectionService } from '../collection/collection.service';
import { FieldService } from '../field/field.service';
import { FileService } from '../file/file.service';
import { UserService } from '../user/user.service';

Injectable();
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly tagService: TagService,
    private readonly collectionService: CollectionService,
    private readonly fieldService: FieldService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
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
    const data = await this.itemRepository
      .findOne({
        where: { id },
        relations: {
          collection: true,
          tags: true,
          likedUsers: {
            avatar: true,
          },
        },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    await this.deleteImage(id).catch(() => {
      throw new NotFoundException('data not found');
    });

    const response = await this.itemRepository.delete(id);
    return response;
  }

  async change(
    value: UpdateItemDto,
    id: string,
    file: Express.Multer.File,
    request,
  ) {
    if (file) {
      const avatar = await this.updateImage(file, id, request);
      value.avatar = avatar;
    }
    const response = await this.itemRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Item)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateItemDto, file: Express.Multer.File, request) {
    const tags = await this.tagService.getMoreByIds(value.tags);
    const collection = await this.collectionService.getOne(value.collection);

    const item = new Item();
    item.name = value.name;
    item.collection = collection;
    item.tags = tags;

    if (file) {
      const avatar = await this.uploadImage(file, request);
      item.avatar = avatar;
    }

    await this.itemRepository.save(item);

    if (value.fields.length) {
      value.fields.forEach((f) => {
        f.item = item.id;
      });
      await this.fieldService.create(value.fields);
    }

    return item;
  }

  async addTag(tagId: string, itemId: string) {
    const tag = await this.tagService.getOne(tagId);
    const item = await this.getOne(itemId);

    item.tags.push(tag);

    await this.itemRepository.save(item);

    return item;
  }

  async addLike(userId: string, itemId: string) {
    const item = await this.getOne(itemId);
    const user = await this.userService.getById(userId);
    item.likedUsers.push(user);
    item.likesCount = item.likedUsers.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(item);
    });

    return item;
  }

  async removeLike(userId: string, itemId: string) {
    const item = await this.getOne(itemId);
    item.likedUsers = item.likedUsers.length
      ? item.likedUsers.filter((lu) => lu.id != userId)
      : [];
    item.likesCount = item.likedUsers.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(item);
    });

    return item;
  }

  async removeTag(tagId: string, itemId: string) {
    const item = await this.getOne(itemId);

    item.tags = item.tags.filter((t) => t.id != tagId);

    await this.itemRepository.save(item);

    return item;
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
