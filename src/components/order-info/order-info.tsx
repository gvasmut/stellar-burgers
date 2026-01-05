import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearSelectedOrder,
  fetchOrderByNumber
} from '../../services/slice/orderSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { selectUser } from '../../services/slice/authSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number?: string }>();
  const orderNumber = number ? parseInt(number) : 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.order.orders);

  const currentOrder = useSelector((state) => state.order.selectedOrder);
  const ingredients = useSelector((state) => state.ingredients.items);

  useEffect(() => {
    if (window.location.pathname.startsWith('/profile/orders') && !user) {
      navigate('/login');
    }
  }, [user, navigate]);
  useEffect(() => {
    if (orderNumber && !currentOrder) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [orderNumber, currentOrder, dispatch]);

  useEffect(
    () => () => {
      dispatch(clearSelectedOrder());
    },
    [dispatch]
  );

  const orderData: TOrder | undefined =
    currentOrder ||
    feedOrders.find((order) => order.number === orderNumber) ||
    profileOrders.find((order) => order.number === orderNumber);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
