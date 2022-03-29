import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Dispatch,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

type StoreContextProps = {
  state: {
    userInfo: User | null;
    cart: {
      cartItems: Product[];
      shippingAddress: Address | null;
      paymentMethod: string;
    };
  };
  finishedShopping: () => FinishedShopping;
  dispatch: Dispatch<Action>;
  updateCartHandler: (product: Product, quantity: number) => void;
  removeProductHandler: (product: Product) => void;
  checkoutHandler: () => void;
  addProductFromHomeScreenCartHandler: (product: Product) => void;
  signOutHandler: () => void;
};

type StoreContextProviderProps = {
  children: ReactNode;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  quantity: number;
  image: string;
  price: number;
  countInStock: number;
};

type User = {
  name: string;
  email: string;
  password: string;
  token: string;
  isAdmin: boolean;
};

type Address = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type State = {
  userInfo: User | null;
  cart: {
    cartItems: Product[];
    shippingAddress: Address | null;
    paymentMethod: string;
  };
};

type Action =
  | {
      type: 'cart_add_item';
      item: Product;
    }
  | {
      type: 'cart_remove_item';
      item: Product;
    }
  | {
      type: 'cart_clear';
    }
  | {
      type: 'user_signin';
      user: User;
    }
  | {
      type: 'user_signout';
    }
  | {
      type: 'save_shipping_address';
      shippingAddress: Address;
    }
  | {
      type: 'save_payment_method';
      paymentMethod: string;
    };

type FinishedShopping = {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
};

export const StoreContext = createContext({} as StoreContextProps);

export function StoreProvider({ children }: StoreContextProviderProps) {
  const initialState: State = {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(String(localStorage.getItem('userInfo')))
      : null,
    cart: {
      cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(String(localStorage.getItem('cartItems')))
        : [],
      shippingAddress: localStorage.getItem('shippingAddress')
        ? JSON.parse(String(localStorage.getItem('shippingAddress')))
        : null,
      paymentMethod: localStorage.getItem('paymentMethod')
        ? String(localStorage.getItem('paymentMethod'))
        : '',
    },
  };

  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state: State, action: Action) {
    switch (action.type) {
      case 'cart_add_item': {
        const newItem = action.item;
        const existItem = state.cart.cartItems.find(
          (item) => item.id === newItem.id
        );
        const cartItems = existItem
          ? state.cart.cartItems.map((item) =>
              item.id === existItem.id ? newItem : item
            )
          : [...state.cart.cartItems, newItem];

        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        return { ...state, cart: { ...state.cart, cartItems } };
      }
      case 'cart_remove_item': {
        const cartItems = state.cart.cartItems.filter(
          (item) => item.id !== action.item.id
        );
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return { ...state, cart: { ...state.cart, cartItems } };
      }
      case 'cart_clear': {
        return { ...state, cart: { ...state.cart, cartItems: [] } };
      }
      case 'user_signin': {
        return { ...state, userInfo: action.user };
      }
      case 'user_signout': {
        return {
          ...state,
          userInfo: null,
          cart: {
            cartItems: [] as unknown as Product[],
            shippingAddress: {} as Address,
            paymentMethod: '',
          },
        };
      }
      case 'save_shipping_address': {
        return {
          ...state,
          cart: {
            ...state.cart,
            shippingAddress: action.shippingAddress,
          },
        };
      }
      case 'save_payment_method': {
        return {
          ...state,
          cart: {
            ...state.cart,
            paymentMethod: action.paymentMethod,
          },
        };
      }
      default:
        return state;
    }
  }

  async function updateCartHandler(product: Product, quantity: number) {
    const response = await api.get(`/api/products/${product.id}`);
    const data: Product = response.data;

    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock');
      return;
    }
    dispatch({ type: 'cart_add_item', item: { ...product, quantity } });
  }

  async function addProductFromHomeScreenCartHandler(product: Product) {
    const existItem = state.cart.cartItems.find(
      (item) => item.id === product.id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const response = await api.get(`/api/products/${product.id}`);
    const data: Product = response.data;

    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock');
      return;
    }

    dispatch({ type: 'cart_add_item', item: { ...product, quantity } });
  }

  async function removeProductHandler(product: Product) {
    dispatch({ type: 'cart_remove_item', item: product });
  }

  function checkoutHandler() {
    navigate('/signin?redirect=/shipping');
  }

  const signOutHandler = () => {
    dispatch({ type: 'user_signout' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  function finishedShopping(): FinishedShopping {
    const round2 = (num: number) =>
      Math.round(num * 100 + Number.EPSILON) / 100;

    const itemsPrice = round2(
      state.cart.cartItems.reduce((item, total) => item + total.price, 0)
    );

    const shippingPrice = itemsPrice > 100 ? round2(0) : round2(10);
    const taxPrice = round2(0.15 * itemsPrice);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };
  }

  return (
    <StoreContext.Provider
      value={{
        state,
        finishedShopping,
        dispatch,
        updateCartHandler,
        removeProductHandler,
        checkoutHandler,
        addProductFromHomeScreenCartHandler,
        signOutHandler,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  return useContext(StoreContext);
}
