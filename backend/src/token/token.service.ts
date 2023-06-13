import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {IPayload, ITokensResponse, JwtDecode} from './types/token.types';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {TokensDocument} from './schemas/token.schema';

import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Tokens') private tokenModel: Model<TokensDocument>,
    private readonly jwtAccessService: JwtService,
    private readonly jwtRefreshService: JwtService
  ) {
  }

  generateTokens(payload: IPayload): ITokensResponse {
    const accessToken = this.jwtAccessService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '7d'
    });
    const refreshToken = this.jwtRefreshService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    });

    return {
      accessToken,
      refreshToken
    };
  }

  async saveToken(userId: string, refreshToken: string) {
    const userById = await this.tokenModel.findOne({user: userId});
    if (userById) {
      userById.refreshToken = refreshToken;
      return await userById.save();
    }
    return await this.tokenModel.create({user: userId, refreshToken});
  }

  async removeTokenByRefreshToken(refreshToken: string) {
    return this.tokenModel.deleteOne({refreshToken});
  }

  async removeTokenByUserEmail(email: string) {
    return this.tokenModel.deleteOne({email});
  }

  async validateAccessToken(accessToken: string) {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      return this.jwtAccessService.verify(accessToken, {secret: process.env.JWT_ACCESS_SECRET});
    } catch (e) {
      throw new UnauthorizedException('Not valid access token');
    }
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      return this.jwtRefreshService.verify(refreshToken, {secret: process.env.JWT_REFRESH_SECRET});
    } catch (e) {
      throw new UnauthorizedException('Not valid refresh token');
    }
  }

  async getEmailByAccessToken(accessToken: string) {
    const decodedToken: JwtDecode = await this.jwtAccessService.decode(accessToken) as JwtDecode;
    return decodedToken.email;
  }

  async findToken(refreshToken: string) {
    return this.tokenModel.findOne({refreshToken});
  }
}
