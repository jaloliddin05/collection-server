import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Collection } from './collection.entity';
import { CollectionRepository } from './collection.repository';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collection]), FileModule, UserModule],
  controllers: [CollectionController],
  providers: [CollectionService, CollectionRepository],
  exports: [CollectionService, CollectionRepository],
})
export class CollectionModule {}
