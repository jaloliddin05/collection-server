import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUserByEmailPassword(email: string, password: string) {
    const user = await this.usersService.getByEmail(email).catch(() => {
      throw new BadRequestException('Invalid email.');
    });
    const isPasswordSame = await this.comparePasswordWithHash(
      password,
      user.password,
    );
    if (!isPasswordSame) {
      throw new BadRequestException('Invalid password');
    }

    if (!user.status) {
      throw new BadRequestException('You have blocked by admin');
    }
    return user;
  }

  async validateUserById(userId: string) {
    const user = await this.usersService.getById(userId).catch(() => {
      throw new BadRequestException('Valid token with non-existent user.');
    });
    return user;
  }

  async comparePasswordWithHash(password: string, hash: string) {
    const isSame = await bcrypt.compare(password, hash);
    return isSame;
  }

  getJWT(type: 'access' | 'refresh', sub: string) {
    const payload = { sub };

    if (type === 'access') {
      return this.jwtService.sign(payload);
    }

    const jwtConfig = this.configService.getOrThrow('jwt');
    return this.jwtService.sign(payload, {
      secret: jwtConfig.refreshTokenSecret,
      expiresIn: jwtConfig.refreshTokenExpiration,
    });
  }
}
