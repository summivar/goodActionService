import axios from 'axios';
import {GoodAction, IAuthResponse} from '@/types/auth';
import {
  AddListItem,
  Friend, FriendGoodActionsWithData,
  LoginUserDto,
  RegistrationUserDto,
  UpdateListItem
} from '@/services/api/types';
import {destroyCookie, setCookie} from 'nookies';

export const BASE_URL = 'http://localhost:7777/api';

const $api = axios.create({
  baseURL: BASE_URL,
});

export const UserApi = {
  async register(dto: RegistrationUserDto): Promise<IAuthResponse> {
    try {
      const {data} = await axios.post<IAuthResponse>(`${BASE_URL}/users/registration`, dto);
      setCookie(null, 'refToken', data.tokens.refreshToken, {sameSite: 'strict'});
      return data;
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async login(dto: LoginUserDto): Promise<IAuthResponse> {
    try {
      const {data} = await axios.post<IAuthResponse>(`${BASE_URL}/users/login`, dto);
      setCookie(null, 'refToken', data.tokens.refreshToken, {sameSite: 'strict'});
      return data;
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async logout(refToken: string): Promise<void> {
    try {
      await $api.get(`/users/logout?refreshToken=${refToken}`);
      destroyCookie(null, 'refToken');
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async checkAuth(refToken: string): Promise<IAuthResponse> {
    try {
      const {data} = await axios.get<IAuthResponse>(`${BASE_URL}/users/refresh?refreshToken=${refToken}`);
      setCookie(null, 'refToken', data.tokens.refreshToken, {sameSite: 'strict'});
      return data;
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async changeUsername(username: string, authToken: string): Promise<IAuthResponse> {
    try {
      const {data} = await $api.put<IAuthResponse>('/users/update', {username: username}, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      return data;
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async addFriend(uniqueId: string, authToken: string): Promise<void> {
    try {
      await $api.post('/users/addFriend', {uniqueId: uniqueId}, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async deleteFriend(uniqueId: string, authToken: string): Promise<void> {
    try {
      await $api.delete('/users/deleteFriend', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          uniqueId: uniqueId
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async getFriends(authToken: string): Promise<Friend[]> {
    try {
      const {data} = await $api.get<Friend[]>('/users/getFriends', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      return data;
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  }
};

export const GoodActionApi = {
  async add(dto: AddListItem, authToken: string): Promise<GoodAction> {
    try {
      const {data} = await $api.post<GoodAction>('/good-action/add', {
        nameOfAction: dto.nameOfAction,
        descriptionOfAction: dto.descriptionOfAction
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      return data;
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async update(dto: UpdateListItem, authToken: string) {
    try {
      await $api.put('/good-action/update', {
        id: dto.id,
        nameOfAction: dto.newNameOfAction,
        descriptionOfAction: dto.newDescriptionOfAction
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async delete(id: string, authToken: string): Promise<GoodAction> {
    try {
      const {data} = await $api.delete<GoodAction>('/good-action/delete', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: {
          id: id
        }
      });

      return data;
    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  },
  async getActionsFriend(id: string, authToken: string) {
    try {
      const {data} = await $api.get<FriendGoodActionsWithData>(`/good-action/getUserActions/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      return data;

    } catch (e) {
      console.log(e);
      throw new Error(`${e}`);
    }
  }
};