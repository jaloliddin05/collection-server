import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateUserDto {
  @ApiProperty({
    description: `Password`,
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  password: string;

  @ApiProperty({
    description: `Name`,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty({
    description: `Email`,
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(125)
  readonly email: string;

  @ApiProperty({
    description: `Collection image`,
    example: 'file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  avatar;
}

export default CreateUserDto;
