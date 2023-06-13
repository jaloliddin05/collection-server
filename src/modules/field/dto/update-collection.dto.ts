import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateFieldDto {
  @ApiProperty({
    description: `type`,
    example: 'boolean',
  })
  @IsOptional()
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: `key`,
    example: 'author',
  })
  @IsOptional()
  @IsString()
  readonly key: string;

  @ApiProperty({
    description: `value`,
    example: 'value',
  })
  @IsOptional()
  @IsString()
  readonly value: string;

  @ApiProperty({
    description: `item`,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  readonly item: string;
}

export default UpdateFieldDto;
