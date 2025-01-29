import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserToken } from './interfaces/user-token.interface';
import { Model } from 'mongoose';
import { CreateUserTokenDto } from './dto/create-user-token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Token') private readonly tokenModel: Model<IUserToken>,
  ) {}

  async create(createUserTokenDto: CreateUserTokenDto): Promise<IUserToken> {
    const userToken = new this.tokenModel(createUserTokenDto);
    return await userToken.save();
  }

  async delete(
    uId: string,
    token: string,
  ): Promise<{ ok?: number; n?: number }> {
    const result = await this.tokenModel.deleteOne({ uId, token });
    return { ok: result.acknowledged ? 1 : 0, n: result.deletedCount };
  }
  async deleteAll(uId: string): Promise<{ ok?: number; n?: number }> {
    const result = await this.tokenModel.deleteMany({ uId });
    return { ok: result.acknowledged ? 1 : 0, n: result.deletedCount };
  }
  async exists(uId: string, token: string): Promise<boolean> {
    const result = await this.tokenModel.exists({ uId, token });
    return result !== null;
  }
}
