import {Request} from 'express';
import {BadRequestException} from '@nestjs/common';

export class HelperService {
  getAccessTokenFromRequest(request: Request): string{
    const authorizationHeader = request.headers.authorization;
    const accessToken = authorizationHeader?.replace('Bearer ', '');

    if (!accessToken) {
      throw new BadRequestException('No access token in request');
    }

    return accessToken;
  }
}