import {IUserModel} from '../types/user.types';
import {GoodAction} from '../../good-action/good-action.model';

export class UserDto {
  id: string;
  email: string;
  username: string;
  uniqueId: string;
  friends: string[];
  goodActions: GoodAction[];

  constructor(model: IUserModel) {
    this.id = model._id;
    this.email = model.email;
    this.username = model.username;
    this.uniqueId = model.uniqueId;
    this.friends = model.friends;
    this.goodActions = model.goodActions;
  }
}