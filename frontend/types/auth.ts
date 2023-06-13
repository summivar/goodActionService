export interface GoodAction {
  id: string;
  creationTime: string;
  nameOfAction: string;
  descriptionOfAction: string;
  addBy: string;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  uniqueId: string;
  friends: string[];
  goodActions: GoodAction[];
}

export interface IAuthResponse {
  tokens: {
    accessToken: string
    refreshToken: string;
  };
  user: IUser,
  isAuth: boolean
}