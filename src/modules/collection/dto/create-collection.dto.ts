import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateCollectionDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

export default CreateCollectionDto;
