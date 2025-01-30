import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import moment from 'moment';
import { Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { CreateUserTokenDto } from 'src/token/dto/create-user-token.dto';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { roleEnum } from 'src/user/enum/role.enum';
import { statusEnum } from 'src/user/enum/status.enum';
import { IUser } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string | undefined;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
  }

  async signUp(createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.userService.create(createUserDto, [roleEnum.user]);
    await this.sendConfirmation(user);
    return true;
  }

  signIn(email, password) {}

  private async generateToken(data, options?: SignOptions): Promise<string> {
    return this.jwtService.sign(data, options);
  }
  private async verifyToken(token): Promise<any> {
    try {
      const data = this.jwtService.verify(token);
      const tokenExists = await this.tokenService.exists(data._id, token);

      if (tokenExists) {
        return data;
      }
      throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async saveToken(createUserTokenDto: CreateUserTokenDto) {
    const userToken = await this.tokenService.create(createUserTokenDto);
    return userToken;
  }
  async confirm(token: string): Promise<IUser> {
    const data = await this.verifyToken(token);
    const user = await this.userService.find(data._id);

    await this.tokenService.delete(data._id, token);

    if (user && user.status === statusEnum.pending) {
      user.status = statusEnum.active;
      return user.save();
    }
    throw new BadRequestException('Confirmation error');
  }

  async sendConfirmation(user: IUser) {
    const expiresIn = 60 * 60 * 24;
    const tokenPayload = {
      _id: user._id,
      status: user.status,
      roles: user.role,
    };
    const expiredAt = moment().add(1, 'day').toISOString();
    const token = await this.generateToken(tokenPayload, { expiresIn });
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;

    await this.saveToken({ token, uId: user._id as Types.ObjectId, expiredAt });
    await this.mailService.send({
      from: this.configService.get<string>('MAKS_MAIL') || '',
      to: user.email,
      subject: 'Verify User',
      text: `Please confirm your email by clicking this link: ${confirmLink}`,
    });
  }
}
