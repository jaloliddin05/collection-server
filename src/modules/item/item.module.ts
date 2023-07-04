import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Item } from './item.entity';
import { ItemRepository } from './item.repository';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TagModule } from '../tag/tag.module';
import { CollectionModule } from '../collection/collection.module';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';
import { FieldModule } from '../field/field.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    TagModule,
    CollectionModule,
    FileModule,
    UserModule,
    FieldModule,
    UserModule,
  ],
  controllers: [ItemController],
  providers: [ItemService, ItemRepository],
  exports: [ItemService, ItemRepository],
})
export class ItemModule {}
