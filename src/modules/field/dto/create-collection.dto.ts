import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateFieldDto {
  @ApiProperty({
    description: `type`,
    example: 'boolean',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: `key`,
    example: 'author',
  })
  @IsNotEmpty()
  @IsString()
  readonly key: string;

  @ApiProperty({
    description: `value`,
    example: 'value',
  })
  @IsNotEmpty()
  @IsString()
  readonly value: string;

  @ApiProperty({
    description: `item`,
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  readonly item: string;
}

export default CreateFieldDto;
