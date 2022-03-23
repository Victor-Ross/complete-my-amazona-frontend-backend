import { useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';

import { api } from '../../services/api';

import { Product } from '../product';
import { LoadingBox } from '../loadingBox';
import { MessageBox } from '../messageBox';

import styles from './styles.module.scss';

type Product = {
  id: string;
  name: string;
  slug: string;
  quantity: number;
  category: string;
  image: string;
  price: number;
  countInStock: number;
  brand: string;
  rating: number;
  numReviews: number;
  description: string;
};

type State = {
  products: Product[];
  isLoading?: boolean;
  error?: string;
};

type Action =
  | { type: 'request' }
  | { type: 'success'; products: [] }
  | { type: 'fail'; error: string };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'request':
      return {
        ...state,
        isLoading: true,
      };
    case 'success':
      return {
        ...state,
        products: action.products,
        isLoading: false,
      };
    case 'fail':
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export function Products() {
  const [{ products, isLoading, error }, dispatch] = useReducer(reducer, {
    products: [] as Product[],
    isLoading: false,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'request' });
      try {
        const response = await api.get('/products');
        dispatch({ type: 'success', products: response.data });
      } catch (error: any) {
        dispatch({ type: 'fail', error: error.message });
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured products</h1>
      <div className={styles.products}>
        {isLoading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
