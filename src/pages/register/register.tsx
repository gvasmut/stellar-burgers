import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { RootState, useSelector } from '../../services/store';
import { register } from '../../services/slice/authSlice';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const isError = useSelector((state: RootState) => state.auth.isError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(register({ name: userName, email, password }))
      .unwrap()
      .catch(() => {
        setErrorText('Ошибка при регистрации. Попробуйте снова.');
      });
  };

  return isLoading ? (
    <Preloader />
  ) : (
    <RegisterUI
      errorText={errorText || (isError ? 'Что-то пошло не так' : '')}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
