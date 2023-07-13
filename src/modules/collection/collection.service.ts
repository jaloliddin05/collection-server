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

import { Collection } from './collection.entity';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';
import { FileService } from '../file/file.service';
import { UserService } from '../user/user.service';

Injectable();
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly connection: DataSource,
  ) {}

  async getAll(
    options: IPaginationOptions,
    userId: string,
  ): Promise<Pagination<Collection>> {
    const data = await paginate<Collection>(
      this.collectionRepository,
      options,
      {
        order: {
          title: 'ASC',
        },
        relations: {
          avatar: true,
          likedUsers: true,
        },
      },
    );

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

  async getTenMoreLikedCollections() {
    const data = await this.collectionRepository.find({
      order: {
        likesCount: 'DESC',
      },
      take: 10,
    });

    return data;
  }

  async getOne(id: string, userId: string) {
    const data = await this.collectionRepository
      .findOne({
        where: { id },
        relations: {
          avatar: true,
          items: {
            avatar: true,
            fields: true,
            tags: true,
            likedUsers: true,
          },
          likedUsers: {
            avatar: true,
          },
        },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
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

  async getById(id: string) {
    const data = await this.collectionRepository
      .findOne({
        where: { id },
        relations: {
          avatar: true,
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
    await this.deleteImage(id);
    const response = await this.collectionRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });

    return response;
  }

  async change(
    value: UpdateCollectionDto,
    id: string,
    file: Express.Multer.File,
    req: any,
    userId: string,
  ) {
    if (file) {
      const avatar = await this.updateImage(file, id, req);
      value.avatar = avatar;
    }
    await this.collectionRepository.update({ id }, value);

    return await this.getOne(id, userId);
  }

  async create(value: CreateCollectionDto, file: Express.Multer.File, req) {
    if (file) {
      const avatar = await this.uploadImage(file, req);
      value.avatar = avatar.id;
    }
    const data = await this.collectionRepository
      .createQueryBuilder()
      .insert()
      .into(Collection)
      .values(value as unknown as Collection)
      .returning('id')
      .execute();

    const collection = this.getById(data.raw[0].id);
    return collection;
  }

  async addLike(userId: string, collectionId: string) {
    const collection = await this.getById(collectionId);
    const user = await this.userService.getById(userId);
    collection.likedUsers.push(user);
    collection.likesCount = collection.likedUsers.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(collection);
    });

    return collection;
  }

  async removeLike(userId: string, collectionId: string) {
    const collection = await this.getById(collectionId);
    collection.likedUsers = collection.likedUsers.length
      ? collection.likedUsers.filter((lu) => lu.id != userId)
      : [];
    collection.likesCount = collection.likedUsers.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(collection);
    });

    return collection;
  }

  async uploadImage(file: Express.Multer.File, request) {
    const avatar = await this.fileService.uploadFile(file, request);
    return avatar;
  }

  async updateImage(file: Express.Multer.File, id: string, request) {
    const data = await this.getById(id);
    let avatar;
    if (data?.avatar?.id) {
      avatar = await this.fileService.updateFile(data.avatar.id, file, request);
    } else {
      avatar = await this.fileService.uploadFile(file, request);
    }

    return avatar;
  }

  async deleteImage(id: string) {
    const data = await this.getById(id);
    if (data?.avatar?.id) {
      await this.fileService.removeFile(data.avatar.id);
    }
  }
}
