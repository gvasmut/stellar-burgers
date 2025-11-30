import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState, useSelector } from '../../services/store';
import { register } from '../../services/slice/authSlice';
import { Preloader } from '@ui';
import { Navigate, useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const navigate = useNavigate();

  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const isError = useSelector((state: RootState) => state.auth.isError);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(register({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        setErrorText('Ошибка при регистрации. Попробуйте снова.');
      });
  };

  if (isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

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
