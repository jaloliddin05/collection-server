import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateItemDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsOptional()
  @IsString()
  readonly name: string;
}

export default UpdateItemDto;
