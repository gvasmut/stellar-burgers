import reducer, { login, selectIsError } from '../slice/loginSlice';
const initialState = {
  isError: false
};

describe('loginSlice reducer', () => {
  it('должен возвращать initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('login.pending → isError сбрасывается в false', () => {
    const state = reducer(
      { isError: true },
      login.pending('', {
        email: 'test@test.com',
        password: '123'
      })
    );

    expect(state.isError).toBe(false);
  });

  it('login.rejected → isError становится true', () => {
    const state = reducer(
      initialState,
      login.rejected(new Error('Ошибка авторизации'), '', {
        email: 'test@test.com',
        password: '123'
      })
    );

    expect(state.isError).toBe(true);
  });
});

describe('loginSlice selectors', () => {
  it('selectIsError возвращает isError из стора', () => {
    const state = {
      login: {
        isError: true,
      }
    };

    expect(selectIsError(state)).toBe(true);
  });
});

