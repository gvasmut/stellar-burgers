import reducer, {
  login,
  register,
  fetchUser,
  updateUser,
  logout,
  initialState
} from '../slice/authSlice';
import { TUser } from '../../utils/types';

const mockUser: TUser = {
  name: 'Test User',
  email: 'user@test.com'
};

describe('authSlice reducer', () => {
  it('должен возвращать начальное состояние (initialState)', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });
  it('Состояние загрузки при успешном входе login.pending → isLoading true', () => {
    const state = reducer(
      initialState,
      login.pending('', {
        email: 'user@test.com',
        password: '123'
      })
    );
    expect(state.isLoading).toBe(true);
  });

  it('Успешный вход.Сохраняет пользователя и авторизацию login.fulfilled → user + isAuthenticated', () => {
    const state = reducer(
      initialState,
      login.fulfilled(mockUser, '', {
        email: 'user@test.com',
        password: '123'
      })
    );

    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
  });

  it('Неудачный вход. login.rejected → isLoading false', () => {
    const state = reducer(
      initialState,
      login.rejected(null, '', {
        email: 'user@test.com',
        password: '123'
      })
    );
    expect(state.isLoading).toBe(false);
  });

  // ---------------- REGISTER ----------------
  it('Успешная регистрация. register.pending → isLoading true, isError false', () => {
    const state = reducer(
      initialState,
      register.pending('', {
        email: 'test@test.com',
        password: '123',
        name: 'Test'
      })
    );

    expect(state.isLoading).toBe(true);
    expect(state.isError).toBe(false);
  });

  it('Успешная ренгистрация.Сохраняет пользователя и авторизацию register.fulfilled → user + isAuthenticated', () => {
    const state = reducer(
      initialState,
      register.fulfilled(mockUser, '', {
        email: 'user@test.com',
        password: '123',
        name: 'Test'
      })
    );

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('Неудачная регистраця register.rejected → isError true', () => {
    const state = reducer(
      initialState,
      register.rejected(null, '', {
        email: 'user@test.com',
        password: '123',
        name: 'Test'
      })
    );

    expect(state.isError).toBe(true);
  });

  it('fetchUser.pending → isLoading true', () => {
    const state = reducer(initialState, fetchUser.pending(''));
    expect(state.isLoading).toBe(true);
  });

  it('Сохраняет пользователя и отмечает авторизацию. fetchUser.fulfilled → user + isAuthChecked', () => {
    const state = reducer(initialState, fetchUser.fulfilled(mockUser, ''));

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  it('Сбрасывает пользователя и авторизацию.fetchUser.rejected → auth сброшен', () => {
    const state = reducer(initialState, fetchUser.rejected(null, ''));

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('Обновление пользователя. updateUser.fulfilled → обновляет user', () => {
    const state = reducer(
      {
        ...initialState,
        user: mockUser
      },
      updateUser.fulfilled({ name: 'Newuser', email: 'new@test.com' }, '', {
        name: 'Newuser'
      })
    );

    expect(state.user).toEqual({
      name: 'Newuser',
      email: 'new@test.com'
    });
  });

  it('Выход logout.fulfilled → сброс состояния', () => {
    const state = reducer(
      {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        isLoading: true,
        isError: true
      },
      logout.fulfilled(undefined, '')
    );

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(false);
  });
});
