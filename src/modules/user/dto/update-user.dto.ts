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
  @MaxLength(50)
  readonly name: string;

  @ApiProperty({
    description: `Email`,
    example: 'johndoe@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(125)
  readonly email: string;
}

export default UpdateUserDto;
