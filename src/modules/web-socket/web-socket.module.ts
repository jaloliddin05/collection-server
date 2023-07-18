import { Module } from '@nestjs/common';
import { CommentGateway } from './web-socket.gateway';
@Module({
  providers: [CommentGateway],
})
export class CommentSocketModule {}
