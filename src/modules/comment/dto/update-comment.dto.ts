import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateCommentDto {
  @ApiProperty({
    description: `text`,
    example: 'something',
  })
  @IsOptional()
  @IsString()
  readonly text: string;

  @ApiProperty({
    description: `date`,
    example: '2022-20-22',
  })
  @IsOptional()
  @IsString()
  updatedDate;
}

export default UpdateCommentDto;
