import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

interface AppState {
  user: User | null;
  isLoading: boolean;
}

const initialState: AppState = {
  user: null,
  isLoading: false
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
    }
  }
});

export const { setUser, setIsLoading } = appSlice.actions;

export default appSlice.reducer;
