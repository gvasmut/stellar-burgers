import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  fetchFeed,
  selectFeedOrders,
  selectFeedLoading
} from '../../services/slice/feedSlice';
import { useSelector, useDispatch } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeed());
    }
  }, [dispatch, orders.length]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
