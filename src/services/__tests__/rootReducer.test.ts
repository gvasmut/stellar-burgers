import { rootReducer } from '../store';
import { initialState as ingredientsInitialState } from '../slice/ingredientsSlice';
import { initialState as burgerConstructorInitialState } from '../slice/burgerConstructorSlice';
import { initialState as orderInitialState } from '../slice/orderSlice';
import { initialState as loginInitialState } from '../slice/loginSlice';
import { initialState as authInitialState } from '../slice/authSlice';
import { initialState as feedInitialState } from '../slice/feedSlice';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние для всех слайсов при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: burgerConstructorInitialState,
      order: orderInitialState,
      login: loginInitialState,
      auth: authInitialState,
      feed: feedInitialState
    });
  });
});
