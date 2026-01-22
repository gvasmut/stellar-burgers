import reducer, {
  fetchFeed,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedError
} from '../slice/feedSlice';
import { TOrder } from '@utils-types';
const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: [],
    status: 'done',
    name: 'Order 1',
    number: 1,
    createdAt: '',
    updatedAt: ''
  }
];

const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

describe('feedSlice reducer', () => {
  it('должен возвращать initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('fetchFeed.pending → isLoading true, error null', () => {
    const state = reducer(initialState, fetchFeed.pending(''));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchFeed.fulfilled → данные загружены', () => {
    const state = reducer(
      initialState,
      fetchFeed.fulfilled(
        {
          orders: mockOrders,
          total: 100,
          totalToday: 10,
          success: false
        },
        ''
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
  });

  it('fetchFeed.rejected → ошибка сохранена', () => {
    const state = reducer(
      initialState,
      fetchFeed.rejected(null, '', undefined, 'Ошибка загрузки')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
describe('feedSlice selectors', () => {
  const state = {
    feed: {
      orders: mockOrders,
      total: 50,
      totalToday: 5,
      isLoading: true,
      error: 'error'
    }
  };

  it('selectFeedOrders возвращает orders', () => {
    expect(selectFeedOrders(state)).toEqual(state.feed.orders);
  });

  it('selectFeedTotal возвращает total', () => {
    expect(selectFeedTotal(state)).toBe(50);
  });

  it('selectFeedTotalToday возвращает totalToday', () => {
    expect(selectFeedTotalToday(state)).toBe(5);
  });

  it('selectFeedLoading возвращает isLoading', () => {
    expect(selectFeedLoading(state)).toBe(true);
  });

  it('selectFeedError возвращает error', () => {
    expect(selectFeedError(state)).toBe('error');
  });
});
