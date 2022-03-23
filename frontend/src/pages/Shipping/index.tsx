import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useStoreContext } from '../../contexts/storeContext';
import { CheckoutSteps } from '../../components/checkoutSteps';

export function ShippingAddressPage() {
  const navigate = useNavigate();

  const { state: storeState, dispatch: storeCTXDispatch } = useStoreContext();
  const { shippingAddress } = storeState.cart;

  const [fullName, setFullName] = useState<string>(
    shippingAddress?.fullName || ''
  );
  const [address, setAddress] = useState<string>(
    shippingAddress?.address || ''
  );
  const [city, setCity] = useState<string>(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState<string>(
    shippingAddress?.postalCode || ''
  );
  const [country, setCountry] = useState<string>(
    shippingAddress?.country || ''
  );

  useEffect(() => {
    if (!storeState.userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [storeState.userInfo, navigate]);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    const shippingAddress = {
      fullName,
      address,
      city,
      postalCode,
      country,
    };

    storeCTXDispatch({ type: 'save_shipping_address', shippingAddress });

    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));

    navigate('/payment');
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <div className="d-flex justify-content-center">
        <Helmet>
          <title>Shipping Address</title>
        </Helmet>
        <div className="w-50">
          <h1 className="my-3">Shipping Address</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button className="buttonsDefaultColors" type="submit">
                Continue
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  );
}
