import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Field } from './field.entity';
import { CreateFieldDto, UpdateFieldDto } from './dto';
import { Repository } from 'typeorm';

Injectable();
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async getOne(id: string) {
    const data = await this.fieldRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.fieldRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });

    return response;
  }

  async change(value: UpdateFieldDto, id: string) {
    const response = await this.fieldRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Field)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async create(value: CreateFieldDto[]) {
    const data = this.fieldRepository
      .createQueryBuilder()
      .insert()
      .into(Field)
      .values(value as unknown as Field)
      .execute();

    return data;
  }
}
