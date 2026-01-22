import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { clearConstructor } from './burgerConstructorSlice';

interface OrderState {
  orderNumber: number | null;
  orders: TOrder[];
  selectedOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  orderNumber: null
};

export const fetchOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchOrders',
  getOrdersApi
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/fetchOrderByNumber',
  async (orderNumber) => {
    const data = await getOrderByNumberApi(orderNumber);
    return data.orders[0];
  }
);

export const postOrder = createAsyncThunk<TOrder, string[]>(
  'orders/postOrder',
  async (ingredientIds, { dispatch }) => {
    const response = await orderBurgerApi(ingredientIds);
    dispatch(clearConstructor());
    return response.order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
    clearOrderNumber(state) {
      state.orderNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      })
      .addCase(postOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
        state.orderNumber = action.payload.number;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      });
  }
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
