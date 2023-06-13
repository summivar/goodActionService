import {GoodAction} from '@/types/auth';

export interface IUserStore {
  isAuth: boolean;
  id: string | null;
  email: string | null;
  username: string | null;
  uniqueId: string | null;
  friends: string[] | null;
  goodActions: GoodAction[] | null;
  error: string | null;
}