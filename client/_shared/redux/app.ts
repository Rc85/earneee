import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

interface AppState {
  user: User | null;
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
