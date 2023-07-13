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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';

import { CreateCollectionDto, UpdateCollectionDto } from './dto';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { MulterStorage } from '../../infra/helpers';
import { FileUploadValidationForUpdate } from '../../infra/validators';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Public()
  @Get('/all/:userId')
  @ApiOperation({ summary: 'Method: returns all Collections' })
  @ApiOkResponse({
    description: 'The collections were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(
    @Route() route: string,
    @Query() query: PaginationDto,
    @Param('userId') userId,
  ) {
    return await this.collectionService.getAll({ ...query, route }, userId);
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single collection by id' })
  @ApiOkResponse({
    description: 'The collection was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<Collection> {
    return this.collectionService.getOne(id, userId);
  }

  @Public()
  @Get('/ten-more-liked')
  @ApiOperation({ summary: 'Method: returns 10 more liked collections' })
  @ApiOkResponse({
    description: 'The collections was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getTenMoreLikedCollections(): Promise<Collection[]> {
    return this.collectionService.getTenMoreLikedCollections();
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: creates new Collection' })
  @ApiCreatedResponse({
    description: 'The collection was created successfully',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: MulterStorage('uploads/image/collection'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() data: CreateCollectionDto,
    @Req() req,
  ) {
    return await this.collectionService.create(data, file, req);
  }

  @Put('/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: updating collection' })
  @ApiOkResponse({
    description: 'Collection was changed',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: MulterStorage('uploads/image/collection'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() data: UpdateCollectionDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return await this.collectionService.change(
      data,
      id,
      file,
      req,
      req.user.id,
    );
  }

  @Patch('/add-like')
  @ApiOperation({ summary: 'Method: adding like to collection' })
  @ApiOkResponse({
    description: 'Like added to collection successfully',
  })
  @HttpCode(HttpStatus.OK)
  async addLike(@Body() data: { userId: string; collectionId: string }) {
    return await this.collectionService.addLike(data.userId, data.collectionId);
  }

  @Patch('/remove-like')
  @ApiOperation({ summary: 'Method: removing like to collection' })
  @ApiOkResponse({
    description: 'Like removed to collection successfully',
  })
  @HttpCode(HttpStatus.OK)
  async removeLike(@Body() data: { userId: string; collectionId: string }) {
    return await this.collectionService.removeLike(
      data.userId,
      data.collectionId,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting collection' })
  @ApiOkResponse({
    description: 'Collection was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.collectionService.deleteOne(id);
  }
}
