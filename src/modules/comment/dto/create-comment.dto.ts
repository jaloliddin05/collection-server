import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateCommentDto {
  @ApiProperty({
    description: `text`,
    example: 'something',
  })
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @ApiProperty({
    description: `user`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly user: string;

  @ApiProperty({
    description: `item`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  item: string;
}

export default CreateCommentDto;
