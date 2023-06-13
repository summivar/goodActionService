import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UsersDocument} from './schemas/user.schema';
import {Model} from 'mongoose';
import {RegisterUserDto} from './dto/register-user.dto';
import {LoginUserDto} from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import {TokenService} from '../token/token.service';
import {UserDto} from './dto/user.dto';
import {Friend, IUserResponse} from './types/user.types';
import {UpdateUserDto} from './dto/update-user.dto';
import {FriendUserDto} from './dto/friend-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UsersDocument>,
    private readonly tokenService: TokenService
  ) {
  }

  async register(registerUserDto: RegisterUserDto): Promise<IUserResponse> {
    const email = registerUserDto.email;
    const username = registerUserDto.username;
    const password = registerUserDto.password;
    const uniqueId = await this.generateUniqueId();
    const candidateByEmail = await this.getUserByEmail(email);

    if (candidateByEmail) {
      throw new BadRequestException(`User already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const newUser = new this.userModel({email: email, username: username, password: hashPassword, uniqueId: uniqueId});
    const userDto = new UserDto(newUser);
    const tokens = this.tokenService.generateTokens({...userDto});

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    await newUser.save();
    return {tokens: tokens, user: userDto, isAuth: true};
  }

  async login(loginUserDto: LoginUserDto): Promise<IUserResponse> {
    const email = loginUserDto.email;
    const password = loginUserDto.password;
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      throw new BadRequestException('Password isn\'t correct');
    }

    const userDto = new UserDto(user);
    const tokens = this.tokenService.generateTokens({...userDto});

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {tokens: tokens, user: userDto, isAuth: true};
  }

  async logout(refreshToken: string) {
    return await this.tokenService.removeTokenByRefreshToken(refreshToken);
  }

  async refresh(refreshToken: string): Promise<IUserResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is clear');
    }

    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    const userData = await this.tokenService.validateRefreshToken(refreshToken);

    if (!tokenFromDb || !userData) {
      throw new UnauthorizedException('Not found token');
    }

    const user = await this.getUserByEmail(userData.email);
    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const userDto = new UserDto(user);
    const tokens = this.tokenService.generateTokens({...userDto});

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {tokens: tokens, user: userDto, isAuth: true};
  }

  async update(updateUserDto: UpdateUserDto, accessToken: string): Promise<IUserResponse> {
    const email = await this.tokenService.getEmailByAccessToken(accessToken);
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User was not found');
    }

    user.username = updateUserDto.username;
    await user.save();

    const userDto = new UserDto(user);
    const tokens = this.tokenService.generateTokens({...userDto});

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {tokens: tokens, user: userDto, isAuth: true};
  }

  async deleteUser(accessToken: string): Promise<User> {
    const email = await this.tokenService.getEmailByAccessToken(accessToken);
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User was not found');
    }

    await this.userModel.deleteOne({email});
    await this.tokenService.removeTokenByUserEmail(user.email);

    return user;
  }

  async addFriend(friendUserDto: FriendUserDto, accessToken: string) {
    if (!friendUserDto.uniqueId.includes('#')) {
      friendUserDto.uniqueId = `#${friendUserDto.uniqueId}`;
    }

    const email = await this.tokenService.getEmailByAccessToken(accessToken);
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User was not found');
    }

    if (!await this.checkUserExistence(friendUserDto.uniqueId)) {
      throw new BadRequestException('Friend-User was not found');
    }

    if (user.uniqueId === friendUserDto.uniqueId) {
      throw new BadRequestException('Cannot add your own uniqueId as a friend');
    }

    if (user.friends.includes(friendUserDto.uniqueId)) {
      throw new BadRequestException('Friend-User is already added');
    }

    user.friends.push(friendUserDto.uniqueId);
    await user.save();

    return friendUserDto.uniqueId;
  }

  async deleteFriend(friendUserDto: FriendUserDto, accessToken: string) {
    if (!friendUserDto.uniqueId.includes('#')) {
      friendUserDto.uniqueId = `#${friendUserDto.uniqueId}`;
    }

    const email = await this.tokenService.getEmailByAccessToken(accessToken);
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User was not found');
    }

    if (!await this.checkUserExistence(friendUserDto.uniqueId)) {
      throw new BadRequestException('Friend-User was not found');
    }

    user.friends = user.friends.filter(friend => friend !== friendUserDto.uniqueId);
    await user.save();

    return friendUserDto.uniqueId;
  }

  async getFriends(accessToken: string): Promise<Friend[]> {
    const email = await this.tokenService.getEmailByAccessToken(accessToken);
    const user = await this.getUserByEmail(email);

    const friends = await this.userModel.find({ friends: user.uniqueId }).exec();

    return friends.map((friend) : {email: string, uniqueId: string} => ({
      email: friend.email,
      uniqueId: friend.uniqueId,
    }));
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({email: email});
  }

  async getUserById(id: string) {
    return this.userModel.findOne({uniqueId: id});
  }

  async generateUniqueId(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 8;
    let id = '#';

    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const randomCharacter = characters.charAt(randomIndex);
      id += randomCharacter;
    }

    const existingUser = await this.userModel.findOne({uniqueId: id});

    if (existingUser) {
      return this.generateUniqueId();
    }

    return id;
  }

  async checkUserExistence(uniqueId: string): Promise<boolean> {
    const user = await this.userModel.findOne({uniqueId: uniqueId}).exec();
    return !!user;
  }
}