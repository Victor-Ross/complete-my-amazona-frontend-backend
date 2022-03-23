import { Helmet } from 'react-helmet-async';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { CheckoutSteps } from '../../components/checkoutSteps';
import { FormEvent, useEffect, useState } from 'react';
import { useStoreContext } from '../../contexts/storeContext';
import { useNavigate } from 'react-router-dom';

export function PaymentMethod() {
  const navigate = useNavigate();

  const { state: storeState, dispatch: storeDispatch } = useStoreContext();
  const {
    cart: { shippingAddress, paymentMethod },
  } = storeState;

  const [paymentMethodName, setPaymentMethodName] = useState<string>(
    paymentMethod || 'PayPal'
  );

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    storeDispatch({
      type: 'save_payment_method',
      paymentMethod: paymentMethodName,
    });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <div>
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <Container className="w-50 text-left">
          <h1 className="my-3">Payment Method</h1>
          <Form onSubmit={submitHandler}>
            <div style={{ fontSize: '1.2rem' }} className="d-block mb-3">
              <Form.Check
                type="radio"
                id="PayPal"
                label="PayPal"
                value="PayPal"
                checked={paymentMethodName === 'PayPal'}
                onChange={(e) => setPaymentMethodName(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '1.2rem' }} className="d-block mb-3">
              <Form.Check
                type="radio"
                id="Stripe"
                label="Stripe"
                value="Stripe"
                checked={paymentMethodName === 'Stripe'}
                onChange={(e) => setPaymentMethodName(e.target.value)}
              />
            </div>
            <Button className="buttonsDefaultColors" type="submit">
              Continue
            </Button>
          </Form>
        </Container>
      </div>
    </>
  );
}
