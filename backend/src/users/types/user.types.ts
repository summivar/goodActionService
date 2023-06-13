import {UserDto} from '../dto/user.dto';
import {ITokensResponse} from '../../token/types/token.types';
import {GoodAction} from '../../good-action/good-action.model';

export interface IUserModel {
  _id: string;
  email: string;
  username: string;
  uniqueId: string;
  friends: string[];
  goodActions: GoodAction[];
}

export interface IUserResponse {
  tokens: ITokensResponse;
  user: UserDto;
  isAuth: boolean;
}

export interface Friend {
  email: string;
  uniqueId: string;
}