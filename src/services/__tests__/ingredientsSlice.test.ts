import reducer, {
  fetchIngredients,
  selectIngredients,
  selectIsLoading,
  selectError,
  initialState
} from '../slice/ingredientsSlice';
import { TIngredient } from '../../utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('ingredientsSlice reducer', () => {
  it('должен возвращать initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('fetchIngredients.pending → isLoading true, error null', () => {
    const state = reducer(initialState, fetchIngredients.pending(''));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.fulfilled → сохраняет ингредиенты и выключает загрузку', () => {
    const state = reducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '')
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('fetchIngredients.rejected → сохраняет ошибку', () => {
    const state = reducer(
      initialState,
      fetchIngredients.rejected(new Error('Ошибка загрузки'), '')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
describe('ingredientsSlice selectors', () => {
  const state = {
    ingredients: {
      items: mockIngredients,
      isLoading: true,
      error: 'error'
    }
  };

  it('selectIngredients возвращает items', () => {
    expect(selectIngredients(state)).toEqual(state.ingredients.items);
  });

  it('selectIsLoading возвращает isLoading', () => {
    expect(selectIsLoading(state)).toBe(true);
  });

  it('selectError возвращает error', () => {
    expect(selectError(state)).toBe('error');
  });
});
