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
  Query,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateTagDto, UpdateTagDto } from './dto';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all tags' })
  @ApiOkResponse({
    description: 'The tags were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.tagService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single tag by id' })
  @ApiOkResponse({
    description: 'The tag was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Tag> {
    return this.tagService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new tag' })
  @ApiCreatedResponse({
    description: 'The tag was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateTagDto) {
    try {
      return await this.tagService.create(data);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating tag' })
  @ApiOkResponse({
    description: 'Tag was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateTagDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.tagService.change(data, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting tag' })
  @ApiOkResponse({
    description: 'Tag was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.tagService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
