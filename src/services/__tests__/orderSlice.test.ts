import reducer, {
  fetchOrders,
  fetchOrderByNumber,
  postOrder,
  initialState
} from '../slice/orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order-id',
  number: 123,
  name: 'Test order',
  status: 'done',
  createdAt: '',
  updatedAt: '',
  ingredients: []
};

describe('orderSlice reducer', () => {
  it('должен вернуть initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('fetchOrders.pending → loading true, error null', () => {
    const state = reducer(initialState, fetchOrders.pending('', undefined));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchOrders.fulfilled → orders заполнены, loading false', () => {
    const state = reducer(
      initialState,
      fetchOrders.fulfilled([mockOrder], '', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual([mockOrder]);
  });

  it('fetchOrders.rejected → error установлен, loading false', () => {
    const state = reducer(
      initialState,
      fetchOrders.rejected(new Error('Ошибка'), '', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  it('fetchOrderByNumber.pending → loading true', () => {
    const state = reducer(initialState, fetchOrderByNumber.pending('', 123));

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchOrderByNumber.fulfilled → selectedOrder установлен', () => {
    const state = reducer(
      initialState,
      fetchOrderByNumber.fulfilled(mockOrder, '', 123)
    );

    expect(state.loading).toBe(false);
    expect(state.selectedOrder).toEqual(mockOrder);
  });

  it('fetchOrderByNumber.rejected → error установлен', () => {
    const state = reducer(
      initialState,
      fetchOrderByNumber.rejected(new Error('Не найдено'), '', 123)
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Не найдено');
  });

  it('postOrder.pending → loading true', () => {
    const state = reducer(initialState, postOrder.pending('', ['1', '2']));

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('postOrder.fulfilled → selectedOrder и orderNumber установлены', () => {
    const state = reducer(
      initialState,
      postOrder.fulfilled(mockOrder, '', ['1', '2'])
    );

    expect(state.loading).toBe(false);
    expect(state.selectedOrder).toEqual(mockOrder);
    expect(state.orderNumber).toBe(mockOrder.number);
  });

  it('postOrder.rejected → error установлен', () => {
    const state = reducer(
      initialState,
      postOrder.rejected(new Error('Ошибка заказа'), '', ['1'])
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка заказа');
  });
});
