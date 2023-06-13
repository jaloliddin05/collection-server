import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../../../infra/shared/types';
import { User } from '../../user/user.entity';

class ReturnUser {
  @ApiProperty({
    description: `Name`,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: `User Email`,
    example: 'john.doe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `User id`,
    example: 'sdawdadewsdewd2132seewq',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: `User role`,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  role: UserRole;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
  }
}

export default ReturnUser;
