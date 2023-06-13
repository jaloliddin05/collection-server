import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Field } from './field.entity';
import { FieldRepository } from './field.repository';
import { CreateFieldDto, UpdateFieldDto } from './dto';

Injectable();
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: FieldRepository,
  ) {}

  async getOne(id: string) {
    const data = await this.fieldRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.fieldRepository.delete(id);
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
