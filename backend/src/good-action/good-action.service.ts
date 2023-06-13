import {BadRequestException, Injectable} from '@nestjs/common';
import {AddGoodActionDto} from './dto/add-good-action.dto';
import {TokenService} from '../token/token.service';
import {UsersService} from '../users/users.service';
import {GoodAction} from './good-action.model';
import {v4 as uuidv4} from 'uuid';
import {DeleteGoodActionDto} from './dto/delete-good-action.dto';
import {UpdateGoodActionDto} from './dto/edit-good-action.dto';
import {FriendGoodActionsWithData} from './types/good-action.types';

@Injectable()
export class GoodActionService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService
  ) {
  }

  async addAction(addGoodActionDto: AddGoodActionDto, accessToken: string): Promise<GoodAction> {
    const user = await this.getUserByAccessToken(accessToken);

    const action = new GoodAction;
    action.id = uuidv4();
    action.nameOfAction = addGoodActionDto.nameOfAction;
    action.descriptionOfAction = addGoodActionDto.descriptionOfAction;
    action.creationTime = new Date().toLocaleString();
    action.addBy = user.email;

    user.goodActions.push(action);
    await user.save();

    return action;
  }

  async updateAction(goodActionDto: UpdateGoodActionDto, accessToken: string): Promise<GoodAction> {
    const user = await this.getUserByAccessToken(accessToken);

    const actionIndex = user.goodActions.findIndex(action => action.id === goodActionDto.id);
    if (actionIndex === -1) {
      throw new BadRequestException('You don\'t have this action');
    }

    const updatedAction = {
      ...user.goodActions[actionIndex],
      nameOfAction: goodActionDto.nameOfAction,
      descriptionOfAction: goodActionDto.descriptionOfAction
    };

    user.goodActions[actionIndex] = updatedAction;
    await user.save();

    return updatedAction;
  }

  async deleteAction(deleteGoodActionDto: DeleteGoodActionDto, accessToken: string): Promise<GoodAction> {
    const user = await this.getUserByAccessToken(accessToken);

    const actionIndex = user.goodActions.findIndex(action => action.id === deleteGoodActionDto.id);
    if (actionIndex === -1) {
      throw new BadRequestException('You don\'t have this action');
    }

    const deletedAction = user.goodActions[actionIndex];
    user.goodActions.splice(actionIndex, 1);
    await user.save();

    return deletedAction;
  }

  async getUserByAccessToken(accessToken: string) {
    const email = await this.tokenService.getEmailByAccessToken(accessToken);
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User was not found');
    }

    return user;
  }

  async getActions(accessToken: string): Promise<GoodAction[]> {
    const user = await this.getUserByAccessToken(accessToken);

    return user.goodActions;
  }

  async getUserActions(id: string, accessToken: string): Promise<FriendGoodActionsWithData> {
    if (!id.includes('#')) {
      id = `#${id}`;
    }

    const user = await this.getUserByAccessToken(accessToken);
    const friendUser = await this.usersService.getUserById(id);

    if (!friendUser) {
      throw new BadRequestException('Friend was not found');
    }

    if (!friendUser.friends.includes(user.uniqueId)) {
      throw new BadRequestException('You don\'t have access to see it');
    }

    return {goodActions: friendUser.goodActions, email: friendUser.email, uniqueId: friendUser.uniqueId};
  }
}
