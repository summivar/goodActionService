import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import {UsersService} from './users.service';
import {RegisterUserDto} from './dto/register-user.dto';
import {ApiSecurity, ApiTags} from '@nestjs/swagger';
import {LoginUserDto} from './dto/login-user.dto';
import {Request, Response} from 'express';
import {JwtGuard} from '../auth/jwt.guard';
import {UpdateUserDto} from './dto/update-user.dto';
import {HelperService} from '../helper/helper.service';
import {FriendUserDto} from './dto/friend-user.dto';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly helperService: HelperService
  ) {
  }

  @Post('registration')
  async register(@Body() userDto: RegisterUserDto, @Res() response: Response): Promise<void> {
    const user = await this.userService.register(userDto);
    response.send(user);
  }

  @Post('login')
  async login(@Body() userDto: LoginUserDto, @Res() response: Response): Promise<void> {
    const user = await this.userService.login(userDto);

    response.send(user);
  }

  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response, @Query('refreshToken') refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new BadRequestException('No refresh token in request');
    }

    const token = await this.userService.logout(refreshToken);

    response.send(token);
  }

  @Get('test')
  async test(): Promise<string> {
    return "WORKED";
  }

  @Get('refresh')
  async refresh(@Req() request: Request, @Res() response: Response, @Query('refreshToken') refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new BadRequestException('No refresh token in request');
    }

    const user = await this.userService.refresh(refreshToken);

    response.send(user);
  }

  @Put('update')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async update(@Req() request: Request, @Res() response: Response, @Body() userDto: UpdateUserDto): Promise<void> {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);
    const user = await this.userService.update(userDto, accessToken);

    response.send(user);
  }

  @Delete('deleteUser')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async deleteUser(@Req() request: Request, @Res() response: Response): Promise<void> {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);
    const deletedUser = await this.userService.deleteUser(accessToken);

    response.send(deletedUser);
  }

  @Post('addFriend')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async addFriend(@Req() request: Request, @Res() response: Response, @Body() friendUserDto: FriendUserDto): Promise<void> {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);
    const uniqueId = await this.userService.addFriend(friendUserDto, accessToken);

    response.send(uniqueId);
  }

  @Delete('deleteFriend')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async deleteFriend(@Req() request: Request, @Res() response: Response, @Body() friendUserDto: FriendUserDto): Promise<void> {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);
    const uniqueId = await this.userService.deleteFriend(friendUserDto, accessToken);

    response.send(uniqueId);
  }

  @Get('getFriends')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async getFriends(@Req() request: Request, @Res() response: Response): Promise<void> {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);
    const friends = await this.userService.getFriends(accessToken);

    response.send(friends);
  }
}