import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUserStore} from '@/store/interfaces/user.types';
import {GoodAction, IAuthResponse} from '@/types/auth';
import {RootState} from '@/store';
import {Friend} from '@/services/api/types';

const initialState: IUserStore = {
  isAuth: false,
  id: null,
  email: null,
  username: null,
  uniqueId: null,
  friends: null,
  goodActions: null,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IAuthResponse>) => {
      state.isAuth = action.payload.isAuth;
      state.id = action.payload.user.id;
      state.email = action.payload.user.email;
      state.username = action.payload.user.username;
      state.uniqueId = action.payload.user.uniqueId;
      state.friends = action.payload.user.friends;
      state.goodActions = action.payload.user.goodActions;
    },
    addGoodAction: (state, action: PayloadAction<GoodAction>) => {
      state.goodActions?.push(action.payload);
    },
    setGoodActions: (state, action: PayloadAction<GoodAction[]>) => {
      state.goodActions = action.payload
    },
    setFriends: (state, action: PayloadAction<string[]>) => {
      state.friends = action.payload
    }
  }
});

export const {setUserData, addGoodAction, setGoodActions, setFriends} = userSlice.actions;
export const selectUserData = (state: RootState) => state;
export const userReducer = userSlice.reducer;