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
  UseInterceptors,
  UploadedFile,
  Req,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';

import { CreateItemDto, UpdateItemDto } from './dto';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { MulterStorage } from '../../infra/helpers';
import { FileUploadValidationForUpdate } from '../../infra/validators';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Public()
  @Get('/all/:userId')
  @ApiOperation({ summary: 'Method: returns all items' })
  @ApiOkResponse({
    description: 'The items were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(
    @Route() route: string,
    @Query() query: PaginationDto,
    @Query('userId') userId: string,
  ) {
    return await this.itemService.getAll({ ...query, route }, userId);
  }

  @Public()
  @Get('/search')
  @ApiOperation({ summary: 'Method: returns items by search' })
  @ApiOkResponse({
    description: 'The items was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async search(@Query('text') text: string) {
    return this.itemService.search(text);
  }

  @Public()
  @Get('/more-liked/:userId')
  @ApiOperation({ summary: 'Method: returns more liked items' })
  @ApiOkResponse({
    description: 'The items was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async moreLiked(@Param('userId') userId: string) {
    return this.itemService.getMoreLiked(userId);
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single item by id' })
  @ApiOkResponse({
    description: 'The item was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string, @Query('userId') userId: string) {
    return this.itemService.getOne(id, userId);
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: creates new item' })
  @ApiCreatedResponse({
    description: 'The item was created successfully',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: MulterStorage('uploads/image/item'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @Body() data: CreateItemDto,
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Req() req,
  ) {
    return await this.itemService.create(data, file, req);
  }

  @Put('/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: updating item' })
  @ApiOkResponse({
    description: 'Item was changed',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: MulterStorage('uploads/image/item'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() data: UpdateItemDto,
    @Param('id') id: string,
    @Req() req,
  ): Promise<UpdateResult> {
    return await this.itemService.change(data, id, file, req);
  }

  @Patch('/add-like')
  @ApiOperation({ summary: 'Method: adding like to item' })
  @ApiOkResponse({
    description: 'Like added to item successfully',
  })
  @HttpCode(HttpStatus.OK)
  async addLike(@Body() data: { userId: string; itemId: string }) {
    return await this.itemService.addLike(data.userId, data.itemId);
  }

  @Patch('/remove-like')
  @ApiOperation({ summary: 'Method: removing like to item' })
  @ApiOkResponse({
    description: 'Like removed to item successfully',
  })
  @HttpCode(HttpStatus.OK)
  async removeLike(@Body() data: { userId: string; itemId: string }) {
    return await this.itemService.removeLike(data.userId, data.itemId);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting item' })
  @ApiOkResponse({
    description: 'Item was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.itemService.deleteOne(id);
  }
}
