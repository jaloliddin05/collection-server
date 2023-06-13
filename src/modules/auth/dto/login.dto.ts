import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

class LoginDto {
  @ApiProperty({
    description: `User's email`,
    example: 'phone.petr@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `User's password`,
    example: 'Rakufo4inC00lGuy',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export default LoginDto;
