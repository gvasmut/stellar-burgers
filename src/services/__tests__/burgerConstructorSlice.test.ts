import reducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  setOrderNumber,
  selectIngredientCount
} from '../slice/burgerConstructorSlice';
import { TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-id')
}));

const bun: TIngredient = {
  _id: 'bun-id',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

const ingredient: TIngredient = {
  _id: 'ingredient-id',
  name: 'Начинка',
  type: 'main',
  proteins: 5,
  fat: 5,
  carbohydrates: 10,
  calories: 100,
  price: 30,
  image: '',
  image_large: '',
  image_mobile: ''
};

const initialState = {
  bun: null,
  ingredients: [],
  orderNumber: null
};

describe('burgerConstructorSlice reducer', () => {
  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('setBun — устанавливает булку', () => {
    const state = reducer(initialState, setBun(bun));

    expect(state.bun).toEqual(bun);
  });

  it('addIngredient — добавляет ингредиент с id', () => {
    const state = reducer(initialState, addIngredient(ingredient));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...ingredient,
      id: 'test-id'
    });
  });

  it('removeIngredient — удаляет ингредиент по id', () => {
    const stateWithIngredient = reducer(
      initialState,
      addIngredient(ingredient)
    );

    const state = reducer(
      stateWithIngredient,
      removeIngredient('test-id')
    );

    expect(state.ingredients).toHaveLength(0);
  });

  it('moveIngredient — меняет порядок ингредиентов', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...ingredient, id: 'id-1' },
        { ...ingredient, id: 'id-2' }
      ]
    };

    const state = reducer(
      stateWithIngredients,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(state.ingredients[0].id).toBe('id-2');
    expect(state.ingredients[1].id).toBe('id-1');
  });

  it('clearConstructor — очищает конструктор', () => {
    const filledState = {
      bun,
      ingredients: [{ ...ingredient, id: 'id-1' }],
      orderNumber: 123
    };

    const state = reducer(filledState, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('setOrderNumber — устанавливает номер заказа', () => {
    const state = reducer(initialState, setOrderNumber(777));

    expect(state.orderNumber).toBe(777);
  });
});

describe('selectIngredientCount selector', () => {
  it('корректно считает количество ингредиентов и булки', () => {
    const state = {
      burgerConstructor: {
        bun,
        ingredients: [
          { ...ingredient, id: 'id-1' },
          { ...ingredient, id: 'id-2' }
        ],
        orderNumber: null
      }
    };

    const result = selectIngredientCount(state as any);

    expect(result).toEqual({
      'bun-id': 1,
      'ingredient-id': 2
    });
  });
});
