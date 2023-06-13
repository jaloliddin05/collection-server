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

import { CreateItemDto, UpdateItemDto } from './dto';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all items' })
  @ApiOkResponse({
    description: 'The items were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.itemService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single item by id' })
  @ApiOkResponse({
    description: 'The item was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Item> {
    return this.itemService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new item' })
  @ApiCreatedResponse({
    description: 'The item was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateItemDto) {
    try {
      return await this.itemService.create(data);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating item' })
  @ApiOkResponse({
    description: 'Item was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() CollectionData: UpdateItemDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.itemService.change(CollectionData, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting item' })
  @ApiOkResponse({
    description: 'Item was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.itemService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
