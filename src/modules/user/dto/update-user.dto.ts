import {
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateUserDto {
  @ApiProperty({
    description: `Name`,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `Email`,
    example: 'johndoe@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(125)
  readonly email: string;

  @ApiProperty({
    description: `User image`,
    example: 'file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  avatar;
}

export default UpdateUserDto;
