import { IsNumber, IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../../../infra/shared/types';
import { ReturnUserDto } from './index';

class JwtPayloadDto {
  @ApiProperty({
    description: `User id`,
    example: 'sdawdadewsdewd2132seewq',
  })
  @IsNotEmpty()
  @IsString()
  sub: string;

  @ApiProperty({
    description: `User Email`,
    example: 'phone.petr@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `User role`,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  role: UserRole;

  constructor(user: ReturnUserDto) {
    this.sub = user.id;
    this.email = user.email;
    this.role = user.role;
  }
}

export default JwtPayloadDto;
