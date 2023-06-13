import {GoodAction} from '../good-action.model';

export interface FriendGoodActionsWithData {
  goodActions: GoodAction[];
  email: string;
  uniqueId: string;
}