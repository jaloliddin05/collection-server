import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateItemDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `collection`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly collection: string;
}

export default CreateItemDto;
