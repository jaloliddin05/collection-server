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
    return await this.itemService.getAll({ ...query, route });
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
  async addLike(@Body() data: { userId: string; collectionId: string }) {
    return await this.itemService.addLike(data.userId, data.collectionId);
  }

  @Patch('/remove-like')
  @ApiOperation({ summary: 'Method: removing like to item' })
  @ApiOkResponse({
    description: 'Like removed to item successfully',
  })
  @HttpCode(HttpStatus.OK)
  async removeLike(@Body() data: { userId: string; collectionId: string }) {
    return await this.itemService.removeLike(data.userId, data.collectionId);
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
