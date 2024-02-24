import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UsersInterface } from '../../../_shared/types';

interface AppState {
  user: UsersInterface | null;
  isLoading: boolean;
  country: string;
}

const initialState: AppState = {
  user: null,
  isLoading: false,
  country: 'CA'
};

const appSlice = createSlice({
  name: 'App',
  initialState,
  reducers: {
    setUser(state, user: PayloadAction<any>) {
      state.user = user.payload;
    },
    setIsLoading(state, loading: PayloadAction<boolean>) {
      state.isLoading = loading.payload;
    },
    setCountry(state, country: PayloadAction<string>) {
      state.country = country.payload;
    }
  }
});

export const { setUser, setIsLoading, setCountry } = appSlice.actions;

export default appSlice.reducer;
