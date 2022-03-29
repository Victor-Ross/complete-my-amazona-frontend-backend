import { useEffect, useReducer, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

import { api } from '../../services/api';
import { getError } from '../../utils/getError';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Rating } from '../../components/rating';
import { LoadingBox } from '../../components/loadingBox';
import { MessageBox } from '../../components/messageBox';
import { Button, Nav } from 'react-bootstrap';
import { Product } from '../../components/product';

import './styles.css';

type State = {
  products: Product[];
  loading: boolean;
  pages: number;
  countProducts: number;
  error: string;
};

type Product = {
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

type Filter = {
  page?: string;
  category?: string;
  query?: string;
  rating?: string;
  price?: string;
  order?: string;
};

type Category = {
  category: string;
};

type Action =
  | {
      type: 'fetch_request';
    }
  | {
      type: 'fetch_success';
      products: Product[];
      page: number;
      pages: number;
      countProducts: number;
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
      return {
        ...state,
        products: action.products,
        page: action.page,
        pages: action.pages,
        countProducts: action.countProducts,
        loading: false,
      };
    case 'fetch_fail':
      return { ...state, error: action.error };
    default:
      return state;
  }
};

const prices = [
  {
    name: 'R$1 to R$50',
    value: '1-50',
  },
  {
    name: 'R$51 to R$200',
    value: '51-200',
  },
  {
    name: 'R$201 to R$1000',
    value: '201-1000',
  },
];

const ratings = [
  {
    name: '4stars & up',
    rating: '4',
  },
  {
    name: '3stars & up',
    rating: '3',
  },
  {
    name: '2stars & up',
    rating: '2',
  },
  {
    name: '1stars & up',
    rating: '1',
  },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const searchParams = new URLSearchParams(String(search));

  const category = searchParams.get('category') || 'all';
  const query = searchParams.get('query') || 'all';
  const price = searchParams.get('price') || 'all';
  const rating = searchParams.get('rating') || 'all';
  const order = searchParams.get('order') || 'newest';
  const page = searchParams.get('page') || 1;

  const [categories, setCategories] = useState<Category[]>([]);

  const [{ loading, error, products, pages, countProducts }, filtersDispatch] =
    useReducer(reducer, {
      loading: true,
    } as State);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const { data } = await api.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        filtersDispatch({
          type: 'fetch_success',
          products: data.products,
          page: data.page,
          pages: data.pages,
          countProducts: data.countProducts,
        });
      } catch (error: any) {
        filtersDispatch({ type: 'fetch_fail', error: getError(error) });
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [category, error, order, page, price, query, rating]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchCategories = async () => {
      try {
        const { data } = await api.get(`/api/products/categories`);
        setCategories(data);
      } catch (error: any) {
        toast.error(getError(error));
      }
    };

    fetchCategories();

    return () => abortController.abort();
  }, [filtersDispatch]);

  const getFilterUrl = (filter: Filter) => {
    const filterPage = String(filter.page || page);
    const filterQuery = String(filter.query || query);
    const filterCategory = String(filter.category || category);
    const filterPrice = String(filter.price || price);
    const filterRating = String(filter.rating || rating);
    const sortOrder = String(filter.order || order);

    return `/search?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search PRoducts</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Department</h3>
          <div>
            <ul>
              <Link
                className={'all' === category ? 'text-bold' : ''}
                to={getFilterUrl({ category: 'all' })}
              >
                Any
              </Link>
              {categories.map((c) => (
                <li key={c.category}>
                  <Link
                    className={category === c.category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c.category })}
                  >
                    {c.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value} className="my-1">
                  <Link
                    className={p.value === price ? 'text-bold' : ''}
                    to={getFilterUrl({ price: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                    to={getFilterUrl({ rating: r.rating })}
                  >
                    <Rating caption={' & up'} rating={Number(r.rating)} />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-bold' : ''}
                >
                  <Rating rating={0} caption={' & up'} />
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle" />
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
                {products.map((product) => (
                  <Col key={product.id} sm={6} lg={4} className="mb-3">
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <div>
                {[...Array(pages).keys()].map((x) => (
                  <Nav.Link
                    key={x + 1}
                    as={Link}
                    className="mx-1"
                    to={getFilterUrl({ page: String(x + 1) })}
                  >
                    <Button
                      className={
                        Number(page) === x + 1
                          ? 'text-bold buttonsDefaultCollors'
                          : ''
                      }
                    >
                      {x + 1}
                    </Button>
                  </Nav.Link>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
