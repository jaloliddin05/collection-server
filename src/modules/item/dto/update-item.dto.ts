import { IsArray, IsOptional, IsString, isArray } from 'class-validator';
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
class UpdateItemDto {
  @ApiProperty({
    description: `title`,
    example: 'SAG Carpets',
  })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `tags`,
    example: '["uuid","uuid"]',
  })
  @IsOptional()
  @IsArray()
  @Transform(parseStringToArray)
  readonly tags: string[];

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

export default UpdateItemDto;
