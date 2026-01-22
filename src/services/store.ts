import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredients from '../services/slice/ingredientsSlice';
import burgerConstructor from '../services/slice/burgerConstructorSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import orderSlice from './slice/orderSlice';
import loginSlice, { login } from './slice/loginSlice';
import authSlice from './slice/authSlice';
import feedSlice from './slice/feedSlice';

export const rootReducer = combineReducers({
  ingredients: ingredients,
  burgerConstructor: burgerConstructor,
  order: orderSlice,
  login: loginSlice,
  auth: authSlice,
  feed: feedSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
