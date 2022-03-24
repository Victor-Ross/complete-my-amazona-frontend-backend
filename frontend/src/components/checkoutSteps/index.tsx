import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './styles.module.css';

type CheckoutStepsProps = {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
};

export function CheckoutSteps({
  step1,
  step2,
  step3,
  step4,
}: CheckoutStepsProps) {
  return (
    <Row className="checkoutSteps">
      <Col className={step1 ? 'active' : ''}>Sign-In</Col>
      <Col className={step2 ? 'active' : ''}>Shipping</Col>
      <Col className={step3 ? 'active' : ''}>Payment</Col>
      <Col className={step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  );
}
