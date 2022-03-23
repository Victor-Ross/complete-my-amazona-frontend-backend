import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { Rating } from '../rating';

import styles from './styles.module.scss';
import { useStoreContext } from '../../contexts/storeContext';

type Product = {
  product: {
    id: string;
    name: string;
    slug: string;
    quantity: number;
    category: string;
    image: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
    description: string;
  };
};

export function Product({ product }: Product) {
  const { addProductFromHomeScreenCartHandler } = useStoreContext();

  return (
    <Card className={styles.productItem}>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title color="secondary">{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(product.price)}
        </Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="secondary" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            className="buttonsDefaultColors"
            onClick={() => addProductFromHomeScreenCartHandler(product)}
          >
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
