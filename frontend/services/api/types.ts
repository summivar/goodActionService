import {GoodAction} from '@/types/auth';

export type LoginUserDto = {
  email: string;
  password: string;
}

export type RegistrationUserDto = {
  email: string;
  username: string;
  password: string;
}

export type UpdateListItem = {
  id: string;
  newNameOfAction: string;
  newDescriptionOfAction: string;
}

export type AddListItem = {
  nameOfAction: string;
  descriptionOfAction: string;
}

export type Friend = {
  email: string;
  uniqueId: string;
}

export type FriendGoodActionsWithData = {
  goodActions: GoodAction[];
  email: string;
  uniqueId: string;
}