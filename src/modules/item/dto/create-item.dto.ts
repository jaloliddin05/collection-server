import { IsArray, IsNotEmpty, IsString, isArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

function parseStringToArray({ key, value }: TransformFnParams) {
  const arr = value ? JSON.parse(value) : '';
  if (!isArray(arr)) {
    throw new BadRequestException(`${key} should be array.`);
  }
  return arr;
}

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

  @ApiProperty({
    description: `tags`,
    example: '["uuid","uuid"]',
  })
  @IsNotEmpty()
  @IsArray()
  // @Transform(parseStringToArray)
  readonly tags: string[];
}

export default CreateItemDto;
