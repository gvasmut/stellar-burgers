import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUserApi } from '@api';

type TLoginState = {
  isError: boolean;
};

const initialState: TLoginState = {
  isError: false
};

export const login = createAsyncThunk(
  'profile/login',
  async (credentials: { email: string; password: string }) =>
    loginUserApi(credentials)
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  selectors: {
    selectIsError: (state) => state.isError
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isError = false;
      })
      .addCase(login.rejected, (state) => {
        state.isError = true;
      });
  }
});

export const { selectIsError } = loginSlice.selectors;
export default loginSlice.reducer;
