import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { Collection } from './collection.entity';
import { CollectionRepository } from './collection.repository';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';
import { FileService } from '../file/file.service';

Injectable();
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: CollectionRepository,
    private readonly fileService: FileService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Collection>,
  ): Promise<Pagination<Collection>> {
    return paginate<Collection>(this.collectionRepository, options, {
      order: {
        title: 'ASC',
      },
      relations: {
        avatar: true,
      },
    });
  }

  async getOne(id: string) {
    const data = await this.collectionRepository.findOne({
      where: { id },
      relations: {
        avatar: true,
        items: true,
      },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    await this.deleteImage(id);
    const response = await this.collectionRepository.delete(id);
    return response;
  }

  async change(
    value: UpdateCollectionDto,
    id: string,
    file: Express.Multer.File,
    req: any,
  ) {
    if (file) {
      const avatar = await this.updateImage(file, id, req);
      value.avatar = avatar;
    }
    await this.collectionRepository.update({ id }, value);

    return await this.getOne(id);
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

    const collection = this.getOne(data.raw[0].id);
    return collection;
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
