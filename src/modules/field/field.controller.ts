import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Delete,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateFieldDto, UpdateFieldDto } from './dto';
import { Field } from './field.entity';
import { FieldService } from './field.service';

@ApiTags('Field')
@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single field by id' })
  @ApiOkResponse({
    description: 'The field was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Field> {
    return this.fieldService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new field' })
  @ApiCreatedResponse({
    description: 'The filed was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateFieldDto[]) {
    return await this.fieldService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating filed' })
  @ApiOkResponse({
    description: 'Field was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateFieldDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.fieldService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting field' })
  @ApiOkResponse({
    description: 'Field was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.fieldService.deleteOne(id);
  }
}
