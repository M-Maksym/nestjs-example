import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { TokenService } from 'src/token/token.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as (
        req: Request,
      ) => string,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(req, user: Partial<IUser>) {
    const token = req.headers.authorization.slice(7);
    if (!user?._id) {
      throw new UnauthorizedException('User ID is missing');
    }
    const tokenExists = await this.tokenService.exists(
      user._id.toString(),
      token,
    );
    if (!tokenExists) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
