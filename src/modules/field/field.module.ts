import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Field } from './field.entity';
import { FieldRepository } from './field.repository';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Field])],
  controllers: [FieldController],
  providers: [FieldService, FieldRepository],
  exports: [FieldService, FieldRepository],
})
export class FieldModule {}
