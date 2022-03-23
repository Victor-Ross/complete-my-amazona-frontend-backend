import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import styles from './styles.module.scss';

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
    <Row className={styles.checkoutSteps}>
      <Col className={step1 ? styles.active : ''}>Sign-In</Col>
      <Col className={step2 ? styles.active : ''}>Shipping</Col>
      <Col className={step3 ? styles.active : ''}>Payment</Col>
      <Col className={step4 ? styles.active : ''}>Place Order</Col>
    </Row>
  );
}
