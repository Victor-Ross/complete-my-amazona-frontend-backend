import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useStoreContext } from '../../contexts/storeContext';
import { api } from '../../services/api';
import { getError } from '../../utils/getError';

import Button from 'react-bootstrap/Button';

import { LoadingBox } from '../../components/loadingBox';
import { MessageBox } from '../../components/messageBox';

import './styles.module.css';

type State = {
  loading: boolean;
  error: string;
  orders: Order[];
};

type Order = {
  id: string;
  name: string;
  slug: string;
  total_price: number;
  created_at: string;
  is_paid: boolean;
  paid_at: string;
  is_delivered: boolean;
  delivered_at: string;
};

type Action =
  | {
      type: 'fetch_request';
    }
  | {
      type: 'fetch_success';
      orders: Order[];
    }
  | {
      type: 'fetch_fail';
      error: string;
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'fetch_request':
      return { ...state, loading: true };
    case 'fetch_success':
      return { ...state, orders: action.orders, loading: false };
    case 'fetch_fail':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const {
    state: { userInfo },
  } = useStoreContext();

  const [{ loading, error, orders }, ordersDispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [] as Order[],
  });

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      if (!userInfo) {
        navigate('/signin');
      }
      try {
        ordersDispatch({ type: 'fetch_request' });
        const { data } = await api.get('/api/orders/mine', {
          headers: { Authorization: `Bearer ${userInfo!.token}` },
        });
        ordersDispatch({ type: 'fetch_success', orders: data });
      } catch (error: any) {
        ordersDispatch({ type: 'fetch_fail', error: getError(error) });
      }
    };

    fetchData();
    return () => {
      abortController.abort();
    };
  }, [userInfo, navigate]);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <td>ID</td>
              <td>DATE</td>
              <td>TOTAL</td>
              <td>PAID</td>
              <td>DELIVERED</td>
              <td>ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'short',
                  }).format(new Date(order.created_at))}
                </td>
                <td>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(order.total_price)}
                </td>
                <td className={order.is_paid === true ? 'paid' : 'notPaid'}>
                  {order.is_paid
                    ? new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'short',
                      }).format(new Date(order.created_at))
                    : 'No'}
                </td>
                <td>
                  {order.is_delivered
                    ? order.delivered_at.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    className="buttonsDefaultColors"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
