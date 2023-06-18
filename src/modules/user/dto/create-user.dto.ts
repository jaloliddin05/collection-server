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
  readonly name: string;

  @ApiProperty({
    description: `Email`,
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(125)
  readonly email: string;
}

export default CreateUserDto;
