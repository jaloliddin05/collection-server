import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Comment } from './comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { Repository } from 'typeorm';

Injectable();
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getOne(id: string) {
    const data = await this.commentRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.commentRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });

    return response;
  }

  async change(value: UpdateCommentDto, id: string) {
    const date = new Date();
    value.updatedDate = date;
    const response = await this.commentRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Comment)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async create(value: CreateCommentDto[]) {
    const data = this.commentRepository
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values(value as unknown as Comment)
      .execute();

    return data;
  }
}
