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
  Req,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateCommentDto, UpdateCommentDto } from './dto';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single comment by id' })
  @ApiOkResponse({
    description: 'The comment was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Comment> {
    return this.commentService.getOne(id);
  }

  @Public()
  @Get('/item/:id')
  @ApiOperation({ summary: 'Method: returns comments by item id' })
  @ApiOkResponse({
    description: 'The comments was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getByItemId(@Param('id') id: string): Promise<Comment[]> {
    return this.commentService.getByItemId(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new comment' })
  @ApiCreatedResponse({
    description: 'The comment was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateCommentDto, @Req() req) {
    return await this.commentService.create(data, req.user.id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating comment' })
  @ApiOkResponse({
    description: 'Comment was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateCommentDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.commentService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting comment' })
  @ApiOkResponse({
    description: 'Comment was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.commentService.deleteOne(id);
  }
}
