import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateCollectionDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `user`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly user: string;

  @ApiProperty({
    description: `Collection image`,
    example: 'file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  avatar: string;
}

export default CreateCollectionDto;
