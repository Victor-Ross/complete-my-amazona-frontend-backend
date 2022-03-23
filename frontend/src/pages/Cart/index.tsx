import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { useStoreContext } from '../../contexts/storeContext';

import { MessageBox } from '../../components/messageBox';

import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export function CartPage() {
  const { state, updateCartHandler, removeProductHandler, checkoutHandler } =
    useStoreContext();
  const {
    cart: { cartItems },
  } = state;

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.id}>
                  <Row className="align-items-center">
                    <Col
                      md="4"
                      className="d-flex align-items-center justify-content-around"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ height: '80px' }}
                        className="img-fluid border border-dark p-1"
                      />{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md="3">
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle" />
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle" />
                      </Button>
                    </Col>
                    <Col md="3">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.price)}
                    </Col>
                    <Col md="2">
                      <Button variant="light">
                        <i
                          className="fas fa-trash"
                          onClick={() => removeProductHandler(item)}
                        />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal (
                    {cartItems.reduce(
                      (total, cartItem) => total + cartItem.quantity,
                      0
                    )}{' '}
                    items):
                    <br />
                    <br />
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(
                      cartItems.reduce(
                        (total, cartItem) =>
                          total + cartItem.price * cartItem.quantity,
                        0
                      )
                    )}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      className="buttonsDefaultColors"
                      type="button"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
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
