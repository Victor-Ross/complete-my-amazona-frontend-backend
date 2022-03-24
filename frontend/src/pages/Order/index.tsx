import { useEffect, useReducer } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from '@paypal/paypal-js/types/components/buttons';

import { useStoreContext } from '../../contexts/storeContext';
import { api } from '../../services/api';
import { getError } from '../../utils/getError';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import { LoadingBox } from '../../components/loadingBox';
import { MessageBox } from '../../components/messageBox';
import { toast } from 'react-toastify';

type State = {
  loading: boolean;
  order: Order;
  error: string;
  loadingPay: boolean;
  successPay: boolean;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  shipping_address: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  isDelivered: boolean;
  deliveredAt: string;
  payment_method: string;
  is_paid: boolean;
  paid_at: string;
  order_products: Product[];
  items_price: number;
  shipping_price: number;
  tax_price: number;
  total_price: number;
};

type Action =
  | {
      type: 'fetch_request';
    }
  | {
      type: 'fetch_success';
      order: Order;
    }
  | {
      type: 'fetch_fail';
      error: string;
    }
  | {
      type: 'pay_request';
    }
  | {
      type: 'pay_success';
    }
  | {
      type: 'pay_fail';
    }
  | {
      type: 'pay_reset';
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'fetch_request':
      return { ...state, loading: true, error: '' };
    case 'fetch_success':
      return { ...state, loading: false, order: action.order, error: '' };
    case 'fetch_fail':
      return { ...state, loading: false, error: action.error };
    case 'pay_request':
      return { ...state, loadingPay: true };
    case 'pay_success':
      return { ...state, loadingPay: false, successPay: true };
    case 'pay_fail':
      return { ...state, loadingPay: false };
    case 'pay_reset':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
};

export default function OrderPage() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const {
    state: { userInfo },
  } = useStoreContext();

  const [{ loading, order, error, successPay, loadingPay }, orderDispatch] =
    useReducer(reducer, {
      loading: true,
      order: {} as Order,
      error: '',
      loadingPay: false,
      successPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(
    data: Record<string, unknown>,
    actions: CreateOrderActions
  ) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: String(order.total_price),
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> {
    return actions.order!.capture().then(async function (details) {
      try {
        orderDispatch({ type: 'pay_request' });
        const { data } = await api.put(`/api/orders/${order.id}/pay`, details, {
          headers: { authorization: `Bearer ${userInfo!.token}` },
        });
        orderDispatch({ type: 'pay_success' });

        toast.success('Order is paid');
      } catch (error: any) {
        orderDispatch({ type: 'pay_fail' });
        toast.error(getError(error));
      }
    });
  }

  function onError(error: any) {
    toast.error(getError(error));
  }

  useEffect(() => {
    if (!userInfo) {
      return navigate('/login');
    }

    let abortController = new AbortController();

    const fetchOrder = async () => {
      try {
        orderDispatch({ type: 'fetch_request' });

        const { data } = await api.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        });
        orderDispatch({ type: 'fetch_success', order: data });
      } catch (error: any) {
        orderDispatch({ type: 'fetch_fail', error: getError(error) });
      }
    };

    if (!order.id || successPay || (order.id && order.id !== orderId)) {
      fetchOrder();
      if (successPay) {
        orderDispatch({ type: 'pay_reset' });
      }

      return () => {
        abortController.abort();
      };
    } else {
      const loadPayPalScript = async () => {
        const { data: clientId } = await api.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'BRL',
          },
        });
        paypalDispatch({
          type: 'setLoadingStatus',
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      loadPayPalScript();
    }
  }, [order, userInfo, successPay, orderId, navigate, paypalDispatch]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order</title>
      </Helmet>
      <h1 className="my-3">{orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {order.shipping_address.fullName} <br />
                <strong>Address: </strong> {order.shipping_address.address},
                {order.shipping_address.city},{' '}
                {order.shipping_address.postalCode},
                {order.shipping_address.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.payment_method}
              </Card.Text>
              {order.is_paid ? (
                <MessageBox variant="success">
                  Paid at{' '}
                  {new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(new Date(order.paid_at))}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.order_products.map((item) => {
                  {
                    console.log('AQUI O EXEMPLO', order);
                  }
                  return (
                    <ListGroup.Item key={item.id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ height: '80px' }}
                            className="img-fluid border border-dark p-1"
                          />{' '}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>{item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.items_price)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.shipping_price)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.tax_price)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(order.total_price)}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
              {!order.is_paid && (
                <ListGroup.Item>
                  {isPending ? (
                    <LoadingBox />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                  )}
                  {loadingPay && <LoadingBox />}
                </ListGroup.Item>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
