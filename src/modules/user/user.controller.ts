import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Delete,
  Param,
  Get,
  Query,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  FileUploadValidationForCreate,
  FileUploadValidationForUpdate,
} from '../../infra/validators';
import { MulterStorage } from '../../infra/helpers';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Method: returns current user' })
  @ApiOkResponse({
    description: 'The user was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() request) {
    return this.usersService.getOne(request.user.id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns user by id' })
  @ApiOkResponse({
    description: 'The user was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    try {
      return await this.usersService.getOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all users' })
  @ApiOkResponse({
    description: 'The users were returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.usersService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: creates new user' })
  @ApiCreatedResponse({
    description: 'The user was created successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/image/user'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async register(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() userData: CreateUserDto,
    @Req() request,
  ): Promise<User> {
    try {
      return await this.usersService.create(userData, file, request);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Method: updating user' })
  @ApiOkResponse({
    description: 'User was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/image/user'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() userData: UpdateUserDto,
    @Param('id') id: string,
    @Req() request,
  ): Promise<UpdateResult | User> {
    try {
      return await this.usersService.change(userData, id, file, request);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting user' })
  @ApiOkResponse({
    description: 'User was deleted',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.usersService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
