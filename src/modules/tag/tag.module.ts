import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from './tag.entity';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService, TagRepository],
  exports: [TagService, TagRepository],
})
export class TagModule {}
