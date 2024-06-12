import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { OrdersInterface, UsersInterface } from '../../../_shared/types';

export interface AppState {
  user: UsersInterface | null;
  isLoading: boolean;
  country: string;
  cart: OrdersInterface | null;
}

const initialState: AppState = {
  user: null,
  isLoading: false,
  country: 'CA',
  cart: null
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
      localStorage.setItem('earneee.country', country.payload);

      state.country = country.payload;
    },
    setCart(state, cart: PayloadAction<OrdersInterface>) {
      state.cart = cart.payload;
    }
  }
});

export const { setUser, setIsLoading, setCountry, setCart } = appSlice.actions;

export default appSlice.reducer;
