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
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all tags' })
  @ApiOkResponse({
    description: 'The tags were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData() {
    return await this.tagService.getAll();
  }

  @Get('/title')
  @ApiOperation({ summary: 'Method: returns tags by title' })
  @ApiOkResponse({
    description: 'The tags was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getTagsByTitle(@Query('title') title: string): Promise<Tag[]> {
    return this.tagService.getTagsByTitle(title);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single tag by id' })
  @ApiOkResponse({
    description: 'The tag was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Tag> {
    return this.tagService.getOne(id);
  }

  @Public()
  @Get('/item/:id')
  @ApiOperation({ summary: 'Method: returns single tag by id' })
  @ApiOkResponse({
    description: 'The tag was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getItemsByTagId(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<Tag> {
    return this.tagService.getItemsByTag(id, userId);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new tag' })
  @ApiCreatedResponse({
    description: 'The tag was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateTagDto) {
    return await this.tagService.create(data);
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
    return await this.tagService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting tag' })
  @ApiOkResponse({
    description: 'Tag was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.tagService.deleteOne(id);
  }
}
