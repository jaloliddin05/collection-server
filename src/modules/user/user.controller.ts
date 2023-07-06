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
  Patch,
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
import { FileUploadValidationForUpdate } from '../../infra/validators';

import { MulterStorage } from '../../infra/helpers';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRoles } from '../../infra/shared/enum';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

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
    return await this.usersService.getOne(id);
  }

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all users' })
  @ApiOkResponse({
    description: 'The users were returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.usersService.getAll({ ...query, route });
  }

  @Public()
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new user' })
  @ApiCreatedResponse({
    description: 'The user was created successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userData: CreateUserDto): Promise<User> {
    return await this.usersService.create(userData);
  }

  @Put('/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: updating user' })
  @ApiOkResponse({
    description: 'User was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @UseInterceptors(
    FileInterceptor('avatar', {
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
    return await this.usersService.change(userData, id, file, request);
  }

  @Roles(userRoles.ADMIN)
  @Patch('/role/:id')
  @ApiOperation({ summary: 'Method: updating user role' })
  @ApiOkResponse({
    description: 'User role was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async changeRole(
    @Body() data,
    @Param('id') id: string,
  ): Promise<UpdateResult | User> {
    return await this.usersService.changeRole(id, data.role);
  }

  @Roles(userRoles.ADMIN)
  @Patch('/role/:id')
  @ApiOperation({ summary: 'Method: updating user status' })
  @ApiOkResponse({
    description: 'User status was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async changeStatus(
    @Body() data,
    @Param('id') id: string,
  ): Promise<UpdateResult | User> {
    return await this.usersService.changeStatus(id, data.role);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting user' })
  @ApiOkResponse({
    description: 'User was deleted',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    return await this.usersService.deleteOne(id);
  }
}
