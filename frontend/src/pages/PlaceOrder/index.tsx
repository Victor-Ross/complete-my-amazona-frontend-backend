import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useReducer } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import { CheckoutSteps } from '../../components/checkoutSteps';
import { useStoreContext } from '../../contexts/storeContext';
import { toast } from 'react-toastify';
import { getError } from '../../utils/getError';
import { api } from '../../services/api';
import { LoadingBox } from '../../components/loadingBox';

type State = {
  loading: boolean;
};

type Action =
  | {
      type: 'create_order_request';
    }
  | {
      type: 'create_order_success';
    }
  | {
      type: 'create_order_fail';
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'create_order_request':
      return { ...state, loading: true };
    case 'create_order_success':
      return { ...state, loading: false };
    case 'create_order_fail':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrder() {
  const navigate = useNavigate();

  const [{ loading }, orderDispatch] = useReducer(reducer, {
    loading: false,
  });

  const {
    state: {
      cart: { shippingAddress, paymentMethod, cartItems },
      userInfo,
    },
    dispatch: storeDispatch,
    finishedShopping,
  } = useStoreContext();

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, navigate]);

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    finishedShopping();

  const placeOrderHandler = async () => {
    try {
      orderDispatch({ type: 'create_order_request' });
      const { data } = await api.post(
        '/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo!.token}`,
          },
        }
      );
      storeDispatch({ type: 'cart_clear' });
      orderDispatch({ type: 'create_order_success' });
      localStorage.removeItem('cartItems');

      navigate(`/order/${data.order.id}`);
    } catch (error: any) {
      orderDispatch({ type: 'create_order_fail' });
      toast.error(getError(error));
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <br />
                <strong>Name:</strong> {shippingAddress?.fullName}
                <br />
                <strong>Address:</strong> {shippingAddress?.address},
                {shippingAddress?.city}, {shippingAddress?.postalCode},
                {shippingAddress?.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>
                  Method: <strong>{paymentMethod}</strong>
                </strong>
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
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
                      <Col md={3}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.price)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex mb-3">
                  <Col>Items</Col>
                  <Col>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(itemsPrice)}
                  </Col>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex mb-3">
                  <Col>Shipping</Col>
                  <Col>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(shippingPrice)}
                  </Col>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex mb-3">
                  <Col>Tax</Col>
                  <Col>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(taxPrice)}
                  </Col>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex mb-3">
                  <Col>
                    <strong>Order Total</strong>
                  </Col>
                  <Col>
                    <strong>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalPrice)}
                    </strong>
                  </Col>
                </ListGroup.Item>
                <ListGroup.Item className="">
                  <div className="d-grid">
                    <Button
                      className="buttonsDefaultColors"
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                    {loading && <LoadingBox />}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
