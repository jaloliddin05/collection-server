import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './user.controller';
import { User } from './user.entity';
import { UsersRepository } from './user.repository';
import { UsersService } from './user.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FileModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UserModule {}
